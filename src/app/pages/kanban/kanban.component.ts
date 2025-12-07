import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskModalComponent, Task } from '../../components/shared/task-modal/task-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { KanbanService } from '../../core/services/kanban.service';
import { TaskResponseDto } from '../../core/dto/task.dto';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { TaskPriority } from '../../core/enums/task-priority.enum';

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
export class KanbanComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'a-fazer',
      title: 'A Fazer',
      color: '#ffc107',
      tasks: []
    },
    {
      id: 'em-progresso',
      title: 'Em Progresso',
      color: '#007bff',
      tasks: []
    },
    {
      id: 'concluido',
      title: 'Concluído',
      color: '#28a745',
      tasks: []
    }
  ];

  isLoading = false;
  kanbanId: number | null = null;
  isTaskModalOpen = false;
  isConfirmModalOpen = false;
  isViewModalOpen = false;
  selectedTask: Task | null = null;
  taskToDelete: Task | null = null;

  constructor(private kanbanService: KanbanService) {}

  ngOnInit(): void {
    this.loadKanban();
  }

  loadKanban(): void {
    this.isLoading = true;
    // Busca todos os kanbans e usa o primeiro ativo
    // TODO: Permitir selecionar kanban específico via rota ou dropdown
    this.kanbanService.findAll({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          this.kanbanId = response.data[0].id;
          this.loadTasks();
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar kanban:', error);
        this.isLoading = false;
      }
    });
  }

  loadTasks(): void {
    if (!this.kanbanId) return;

    this.kanbanService.findAllTasks(this.kanbanId).subscribe({
      next: (tasks) => {
        this.distributeTasksInColumns(tasks);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.isLoading = false;
      }
    });
  }

  private distributeTasksInColumns(tasks: TaskResponseDto[]): void {
    // Limpa as colunas
    this.columns.forEach(col => col.tasks = []);

    // Distribui tarefas nas colunas baseado no status
    tasks.forEach(taskDto => {
      const task = this.mapTaskFromApi(taskDto);
      const column = this.columns.find(c => c.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });
  }

  private mapTaskFromApi(taskDto: TaskResponseDto): Task {
    const statusMap: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'a-fazer',
      [TaskStatus.IN_PROGRESS]: 'em-progresso',
      [TaskStatus.DONE]: 'concluido',
    };

    const priorityMap: Record<TaskPriority, 'low' | 'medium' | 'high'> = {
      [TaskPriority.LOW]: 'low',
      [TaskPriority.MEDIUM]: 'medium',
      [TaskPriority.HIGH]: 'high',
      [TaskPriority.URGENT]: 'high',
    };

    return {
      id: taskDto.id.toString(),
      title: taskDto.titulo,
      description: taskDto.descricao || '',
      status: statusMap[taskDto.status] || 'a-fazer',
      priority: priorityMap[taskDto.prioridade] || 'medium',
      proposal: '', // TODO: API não retorna proposta no task
      client: '', // TODO: API não retorna cliente no task
      startDate: taskDto.dataInicio ? new Date(taskDto.dataInicio) : undefined,
      dueDate: taskDto.dataVencimento ? new Date(taskDto.dataVencimento) : undefined,
    };
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;

      // Move localmente primeiro para feedback visual imediato
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      movedTask.status = newStatus;

      // Atualiza no backend
      this.updateTaskStatus(movedTask, newStatus);
    }
  }

  private updateTaskStatus(task: Task, newStatus: string): void {
    if (!this.kanbanId) return;

    const statusMap: Record<string, TaskStatus> = {
      'a-fazer': TaskStatus.TODO,
      'em-progresso': TaskStatus.IN_PROGRESS,
      'concluido': TaskStatus.DONE,
    };

    const taskId = parseInt(task.id);
    this.kanbanService.moveTask(this.kanbanId, taskId, {
      novoStatus: statusMap[newStatus]
    }).subscribe({
      next: () => {
        console.log('Tarefa movida com sucesso');
      },
      error: (error) => {
        console.error('Erro ao mover tarefa:', error);
        // TODO: Reverter movimento local se falhar
      }
    });
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

  handleTaskSaved(task: any) {
    if (!this.kanbanId) return;

    const statusMap: Record<string, TaskStatus> = {
      'a-fazer': TaskStatus.TODO,
      'em-progresso': TaskStatus.IN_PROGRESS,
      'concluido': TaskStatus.DONE,
    };

    const priorityMap: Record<string, TaskPriority> = {
      'low': TaskPriority.LOW,
      'medium': TaskPriority.MEDIUM,
      'high': TaskPriority.HIGH,
    };

    const taskDto = {
      titulo: task.title,
      descricao: task.description,
      status: statusMap[task.status] || TaskStatus.TODO,
      prioridade: priorityMap[task.priority] || TaskPriority.MEDIUM,
      dataVencimento: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString(),
      dataInicio: task.startDate ? new Date(task.startDate).toISOString() : undefined,
      kanbanId: this.kanbanId,
    };

    if (task.id && task.id !== 'new') {
      // Atualizar tarefa existente
      const taskId = parseInt(task.id);
      this.kanbanService.updateTask(this.kanbanId, taskId, taskDto).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
        }
      });
    } else {
      // Criar nova tarefa
      this.kanbanService.createTask(this.kanbanId, taskDto).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
        }
      });
    }
  }

  confirmDeleteTask(task: Task) {
    this.taskToDelete = task;
    this.isConfirmModalOpen = true;
  }

  deleteTaskConfirmed() {
    if (this.taskToDelete && this.kanbanId) {
      const taskId = parseInt(this.taskToDelete.id);
      this.kanbanService.removeTask(this.kanbanId, taskId).subscribe({
        next: () => {
          this.loadTasks();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar tarefa:', error);
          this.closeConfirmModal();
        }
      });
    }
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
      this.updateTaskStatus(task, newStatus);
    }
  }
}
