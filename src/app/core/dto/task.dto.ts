import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export interface CreateTaskDto {
  titulo: string;
  descricao?: string;
  status?: TaskStatus;
  prioridade?: TaskPriority;
  dataInicio?: string; // Formato ISO 'YYYY-MM-DDTHH:mm:ss.sssZ'
  dataVencimento: string; // Formato ISO
  kanbanId: number;
  estimativaHoras?: number;
  tags?: string[];
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface MoveTaskDto {
    novoStatus: TaskStatus;
    novaOrdem?: number;
}

export interface BlockTaskDto {
    motivoBloqueio: string;
}

export interface TaskResponseDto {
  id: number;
  titulo: string;
  descricao?: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  dataInicio?: Date;
  dataVencimento: Date;
  dataConclusao?: Date;
  estimativaHoras?: number;
  horasGastas?: number;
  tags: string[];
  kanbanId: number;
  ordem: number;
  bloqueada: boolean;
  motivoBloqueio?: string;
  createdAt: Date;
  updatedAt: Date;
}