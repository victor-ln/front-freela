import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KanbanResponseDto, CreateKanbanDto, UpdateKanbanDto } from '../dto/kanban.dto';
import { TaskResponseDto, CreateTaskDto, UpdateTaskDto, MoveTaskDto, BlockTaskDto } from '../dto/task.dto';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  private apiUrl = `${environment.apiUrl}/kanbans`;

  constructor(private http: HttpClient) { }

  // Kanban Endpoints
  create(createDto: CreateKanbanDto): Observable<KanbanResponseDto> {
    return this.http.post<KanbanResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<KanbanResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<KanbanResponseDto>>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<KanbanResponseDto> {
    return this.http.get<KanbanResponseDto>(`${this.apiUrl}/${id}`);
  }

  findByProposal(propostaId: number): Observable<KanbanResponseDto> {
    return this.http.get<KanbanResponseDto>(`${this.apiUrl}/proposal/${propostaId}`);
  }

  getMetrics(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/metrics`);
  }

  update(id: number, updateDto: UpdateKanbanDto): Observable<KanbanResponseDto> {
    return this.http.patch<KanbanResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  // Task Endpoints
  createTask(kanbanId: number, createDto: CreateTaskDto): Observable<TaskResponseDto> {
    return this.http.post<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks`, createDto);
  }

  findAllTasks(kanbanId: number): Observable<TaskResponseDto[]> {
    return this.http.get<TaskResponseDto[]>(`${this.apiUrl}/${kanbanId}/tasks`);
  }
  
  findTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    return this.http.get<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}`);
  }

  updateTask(kanbanId: number, taskId: number, updateDto: UpdateTaskDto): Observable<TaskResponseDto> {
    return this.http.patch<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}`, updateDto);
  }

  moveTask(kanbanId: number, taskId: number, moveDto: MoveTaskDto): Observable<TaskResponseDto> {
    return this.http.patch<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}/move`, moveDto);
  }

  blockTask(kanbanId: number, taskId: number, blockDto: BlockTaskDto): Observable<TaskResponseDto> {
    return this.http.patch<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}/block`, blockDto);
  }

  unblockTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    return this.http.patch<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}/unblock`, {});
  }
  
  completeTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    return this.http.patch<TaskResponseDto>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}/complete`, {});
  }

  removeTask(kanbanId: number, taskId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${kanbanId}/tasks/${taskId}`);
  }
}