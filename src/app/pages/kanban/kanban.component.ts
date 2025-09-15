import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  proposal: string;
  client: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
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

  getTotalTasks(): number {
    return this.columns.reduce((total, column) => total + column.tasks.length, 0);
  }

  getTasksByStatus(status: string): Task[] {
    const column = this.columns.find(col => col.id === status);
    return column ? column.tasks : [];
  }

  getOverdueTasks(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.columns
      .flatMap(column => column.tasks)
      .filter(task => task.dueDate && task.dueDate < today && task.status !== 'concluido');
  }

  getCompletionRate(): number {
    const completed = this.getTasksByStatus('concluido').length;
    const total = this.getTotalTasks();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'concluido') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return task.dueDate < today;
  }

  moveTask(task: Task, newStatus: string): void {
    // Remove task from current column
    const currentColumn = this.columns.find(col => col.id === task.status);
    if (currentColumn) {
      const taskIndex = currentColumn.tasks.findIndex(t => t.id === task.id);
      if (taskIndex > -1) {
        currentColumn.tasks.splice(taskIndex, 1);
      }
    }

    // Add task to new column
    const newColumn = this.columns.find(col => col.id === newStatus);
    if (newColumn) {
      task.status = newStatus;
      newColumn.tasks.push(task);
    }
  }
}