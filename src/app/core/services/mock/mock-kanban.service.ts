import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, take, map } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { MockProposalService } from './mock-proposal.service';
import { KanbanResponseDto, CreateKanbanDto, UpdateKanbanDto } from '../../dto/kanban.dto';
import { TaskResponseDto, CreateTaskDto, UpdateTaskDto, MoveTaskDto, BlockTaskDto } from '../../dto/task.dto';
import { PaginatedResponseDto, PaginationDto } from '../../../common/dto/pagination.dto';
import { TaskStatus } from '../../enums/task-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';

@Injectable({
  providedIn: 'root'
})
export class MockKanbanService {
  private readonly KANBAN_ENTITY = 'kanbans';
  private readonly TASK_ENTITY = 'tasks';

  constructor(
    private storage: MockStorageService,
    private proposalService: MockProposalService
  ) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // No seed data - users create their own kanbans and tasks
    this.storage.initializeIfEmpty(this.KANBAN_ENTITY, []);
    this.storage.initializeIfEmpty(this.TASK_ENTITY, []);
  }

  // Kanban CRUD operations
  create(createDto: CreateKanbanDto): Observable<KanbanResponseDto> {
    return this.proposalService.findOne(createDto.propostaId).pipe(
      map(proposal => {
        const newKanban: KanbanResponseDto = {
          id: 0,
          titulo: createDto.titulo,
          descricao: createDto.descricao,
          proposta: proposal,
          colunas: createDto.colunas || ['a-fazer', 'em-progresso', 'concluido'],
          ativo: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const saved = this.storage.add(this.KANBAN_ENTITY, newKanban);
        return saved as KanbanResponseDto;
      }),
      delay(300)
    );
  }

  // Create a standalone kanban without a proposal
  createStandalone(createDto: Omit<CreateKanbanDto, 'propostaId'> & { propostaId?: number }): Observable<KanbanResponseDto> {
    const newKanban: Partial<KanbanResponseDto> = {
      id: 0,
      titulo: createDto.titulo,
      descricao: createDto.descricao,
      colunas: createDto.colunas || ['a-fazer', 'em-progresso', 'concluido'],
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.KANBAN_ENTITY, newKanban);
    return of(saved as KanbanResponseDto).pipe(delay(300));
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<KanbanResponseDto>> {
    const kanbans = this.storage.get<KanbanResponseDto>(this.KANBAN_ENTITY);

    let filtered = kanbans;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = kanbans.filter(k =>
        k.titulo.toLowerCase().includes(search) ||
        k.descricao?.toLowerCase().includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<KanbanResponseDto> = {
      data,
      meta: {
        totalItems: filtered.length,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(filtered.length / limit),
        currentPage: page
      }
    };

    return of(response).pipe(delay(300));
  }

  findOne(id: number): Observable<KanbanResponseDto> {
    const kanban = this.storage.findById<KanbanResponseDto>(this.KANBAN_ENTITY, id);
    if (!kanban) {
      return throwError(() => new Error('Kanban não encontrado'));
    }
    return of(kanban).pipe(delay(300));
  }

  findByProposal(propostaId: number): Observable<KanbanResponseDto> {
    const kanbans = this.storage.get<KanbanResponseDto>(this.KANBAN_ENTITY);
    const kanban = kanbans.find(k => k.proposta?.id === propostaId);
    if (!kanban) {
      return throwError(() => new Error('Kanban não encontrado para esta proposta'));
    }
    return of(kanban).pipe(delay(300));
  }

  getMetrics(id: number): Observable<any> {
    const tasks = this.storage.get<TaskResponseDto>(this.TASK_ENTITY)
      .filter(t => t.kanbanId === id);

    const metrics = {
      totalTasks: tasks.length,
      todoTasks: tasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgressTasks: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      doneTasks: tasks.filter(t => t.status === TaskStatus.DONE).length,
      blockedTasks: tasks.filter(t => t.bloqueada).length,
      completionRate: tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100)
        : 0,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimativaHoras || 0), 0),
      totalSpentHours: tasks.reduce((sum, t) => sum + (t.horasGastas || 0), 0)
    };

    return of(metrics).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateKanbanDto): Observable<KanbanResponseDto> {
    const kanban = this.storage.findById<KanbanResponseDto>(this.KANBAN_ENTITY, id);
    if (!kanban) {
      return throwError(() => new Error('Kanban não encontrado'));
    }

    const updated: KanbanResponseDto = {
      ...kanban,
      titulo: updateDto.titulo || kanban.titulo,
      descricao: updateDto.descricao ?? kanban.descricao,
      colunas: updateDto.colunas || kanban.colunas,
      updatedAt: new Date()
    };

    this.storage.update(this.KANBAN_ENTITY, id, updated);
    return of(updated).pipe(delay(300));
  }

  // Task CRUD operations
  createTask(kanbanId: number, createDto: CreateTaskDto): Observable<TaskResponseDto> {
    const kanban = this.storage.findById<KanbanResponseDto>(this.KANBAN_ENTITY, kanbanId);
    if (!kanban) {
      return throwError(() => new Error('Kanban não encontrado'));
    }

    const tasks = this.storage.get<TaskResponseDto>(this.TASK_ENTITY)
      .filter(t => t.kanbanId === kanbanId);
    const maxOrdem = tasks.length > 0 ? Math.max(...tasks.map(t => t.ordem)) : 0;

    const newTask: TaskResponseDto = {
      id: 0,
      titulo: createDto.titulo,
      descricao: createDto.descricao,
      status: createDto.status || TaskStatus.TODO,
      prioridade: createDto.prioridade || TaskPriority.MEDIUM,
      dataInicio: createDto.dataInicio ? new Date(createDto.dataInicio) : undefined,
      dataVencimento: new Date(createDto.dataVencimento),
      estimativaHoras: createDto.estimativaHoras,
      tags: createDto.tags || [],
      kanbanId: kanbanId,
      ordem: maxOrdem + 1,
      bloqueada: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.TASK_ENTITY, newTask);
    return of(saved as TaskResponseDto).pipe(delay(300));
  }

  findAllTasks(kanbanId: number): Observable<TaskResponseDto[]> {
    const tasks = this.storage.get<TaskResponseDto>(this.TASK_ENTITY)
      .filter(t => t.kanbanId === kanbanId)
      .sort((a, b) => a.ordem - b.ordem);
    return of(tasks).pipe(delay(300));
  }

  findTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }
    return of(task).pipe(delay(300));
  }

  updateTask(kanbanId: number, taskId: number, updateDto: UpdateTaskDto): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const updated: TaskResponseDto = {
      ...task,
      titulo: updateDto.titulo || task.titulo,
      descricao: updateDto.descricao ?? task.descricao,
      status: updateDto.status || task.status,
      prioridade: updateDto.prioridade || task.prioridade,
      dataInicio: updateDto.dataInicio ? new Date(updateDto.dataInicio) : task.dataInicio,
      dataVencimento: updateDto.dataVencimento ? new Date(updateDto.dataVencimento) : task.dataVencimento,
      estimativaHoras: updateDto.estimativaHoras ?? task.estimativaHoras,
      tags: updateDto.tags || task.tags,
      updatedAt: new Date()
    };

    this.storage.update(this.TASK_ENTITY, taskId, updated);
    return of(updated).pipe(delay(300));
  }

  moveTask(kanbanId: number, taskId: number, moveDto: MoveTaskDto): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const updated: TaskResponseDto = {
      ...task,
      status: moveDto.novoStatus,
      ordem: moveDto.novaOrdem ?? task.ordem,
      dataConclusao: moveDto.novoStatus === TaskStatus.DONE ? new Date() : task.dataConclusao,
      updatedAt: new Date()
    };

    this.storage.update(this.TASK_ENTITY, taskId, updated);
    return of(updated).pipe(delay(300));
  }

  blockTask(kanbanId: number, taskId: number, blockDto: BlockTaskDto): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const updated: TaskResponseDto = {
      ...task,
      bloqueada: true,
      motivoBloqueio: blockDto.motivoBloqueio,
      updatedAt: new Date()
    };

    this.storage.update(this.TASK_ENTITY, taskId, updated);
    return of(updated).pipe(delay(300));
  }

  unblockTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const updated: TaskResponseDto = {
      ...task,
      bloqueada: false,
      motivoBloqueio: undefined,
      updatedAt: new Date()
    };

    this.storage.update(this.TASK_ENTITY, taskId, updated);
    return of(updated).pipe(delay(300));
  }

  completeTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const updated: TaskResponseDto = {
      ...task,
      status: TaskStatus.DONE,
      dataConclusao: new Date(),
      updatedAt: new Date()
    };

    this.storage.update(this.TASK_ENTITY, taskId, updated);
    return of(updated).pipe(delay(300));
  }

  removeTask(kanbanId: number, taskId: number): Observable<{ message: string }> {
    const task = this.storage.findById<TaskResponseDto>(this.TASK_ENTITY, taskId);
    if (!task || task.kanbanId !== kanbanId) {
      return throwError(() => new Error('Tarefa não encontrada'));
    }

    const success = this.storage.delete(this.TASK_ENTITY, taskId);
    if (!success) {
      return throwError(() => new Error('Erro ao remover tarefa'));
    }
    return of({ message: 'Tarefa removida com sucesso' }).pipe(delay(300));
  }
}
