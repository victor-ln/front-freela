import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskModalComponent, Task } from '../../components/shared/task-modal/task-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

@Component({
    selector: 'app-kanban',
    imports: [CommonModule, DragDropModule, TaskModalComponent, ConfirmModalComponent],
    templateUrl: `./kanban.component.html`,
    styleUrl: `./kanban.component.css`
})
export class KanbanComponent {
  columns: Column[] = [
    {
      id: 'a-fazer',
      title: 'A Fazer',
      color: '#ffc107',
      tasks: [
        {
          id: '1',
          title: 'Configurar ambiente de desenvolvimento',
          description: 'Instalar e configurar todas as ferramentas necessárias para o projeto',
          status: 'a-fazer',
          priority: 'high',
          proposal: 'Website Corporativo',
          client: 'Empresa ABC',
          dueDate: new Date('2024-02-20')
        },
        {
          id: '2',
          title: 'Análise de requisitos UX',
          description: 'Realizar auditoria completa da experiência do usuário atual',
          status: 'a-fazer',
          priority: 'medium',
          proposal: 'Consultoria UX',
          client: 'Tech Inovação',
          dueDate: new Date('2024-02-25')
        }
      ]
    },
    {
      id: 'em-progresso',
      title: 'Em Progresso',
      color: '#007bff',
      tasks: [
        {
          id: '3',
          title: 'Desenvolvimento da API backend',
          description: 'Criar endpoints REST para integração com o frontend',
          status: 'em-progresso',
          priority: 'high',
          proposal: 'Website Corporativo',
          client: 'Empresa ABC',
          startDate: new Date('2024-02-10'),
          dueDate: new Date('2024-02-18')
        },
        {
          id: '4',
          title: 'Design das telas principais',
          description: 'Criar layouts responsivos para as páginas principais',
          status: 'em-progresso',
          priority: 'medium',
          proposal: 'Website Corporativo',
          client: 'Empresa ABC',
          startDate: new Date('2024-02-12'),
          dueDate: new Date('2024-02-22')
        }
      ]
    },
    {
      id: 'concluido',
      title: 'Concluído',
      color: '#28a745',
      tasks: [
        {
          id: '5',
          title: 'Prototipação inicial',
          description: 'Criar wireframes e protótipos de baixa fidelidade',
          status: 'concluido',
          priority: 'low',
          proposal: 'Website Corporativo',
          client: 'Empresa ABC',
          startDate: new Date('2024-02-01'),
          dueDate: new Date('2024-02-08')
        },
        {
          id: '6',
          title: 'Definição da arquitetura',
          description: 'Documentar a arquitetura técnica do projeto',
          status: 'concluido',
          priority: 'high',
          proposal: 'Website Corporativo',
          client: 'Empresa ABC',
          startDate: new Date('2024-02-05'),
          dueDate: new Date('2024-02-10')
        }
      ]
    }
  ];

  isTaskModalOpen = false;
  isConfirmModalOpen = false;
  isViewModalOpen = false;
  selectedTask: Task | null = null;
  taskToDelete: Task | null = null;

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = event.container.id;
    }
  }

  openNewTaskModal(status: string) {
    this.selectedTask = null;
    this.isTaskModalOpen = true;
  }

  openEditTaskModal(task: Task) {
    this.selectedTask = { ...task };
    this.isTaskModalOpen = true;
  }

  openViewTaskModal(task: Task) {
    this.selectedTask = { ...task };
    this.isViewModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
    this.isViewModalOpen = false;
    this.selectedTask = null;
  }

  handleTaskSaved(task: Task) {
    const index = this.columns.flatMap(c => c.tasks).findIndex(t => t.id === task.id);
    if (index > -1) {
      this.columns.forEach(c => c.tasks = c.tasks.filter(t => t.id !== task.id));
      const column = this.columns.find(c => c.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    } else {
      const column = this.columns.find(c => c.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    }
    this.closeTaskModal();
  }

  confirmDeleteTask(task: Task) {
    this.taskToDelete = task;
    this.isConfirmModalOpen = true;
  }

  deleteTaskConfirmed() {
    if (this.taskToDelete) {
      this.columns.forEach(c => c.tasks = c.tasks.filter(t => t.id !== this.taskToDelete!.id));
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.taskToDelete = null;
  }

  getTotalTasks(): number {
    return this.columns.reduce((acc, column) => acc + column.tasks.length, 0);
  }

  getTasksByStatus(status: string): Task[] {
    const column = this.columns.find(c => c.id === status);
    return column ? column.tasks : [];
  }

  getOverdueTasks(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.columns.flatMap(c => c.tasks).filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'concluido');
  }

  getCompletionRate(): number {
    const total = this.getTotalTasks();
    if (total === 0) return 0;
    const completed = this.getTasksByStatus('concluido').length;
    return Math.round((completed / total) * 100);
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  }

  moveTask(task: Task, newStatus: string) {
    const oldColumn = this.columns.find(c => c.id === task.status);
    const newColumn = this.columns.find(c => c.id === newStatus);
    if (oldColumn && newColumn) {
      oldColumn.tasks = oldColumn.tasks.filter(t => t.id !== task.id);
      task.status = newStatus;
      newColumn.tasks.push(task);
    }
  }
}