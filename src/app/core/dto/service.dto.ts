import { ServiceStatus } from '../enums/service-status.enum';
import { TimeUnit } from '../enums/time-unit.enum';
import { CategoryResponseDto } from './category.dto';
import { TemplateResponseDto } from './template.dto';

export interface CreateServiceDto {
  nome: string;
  descricao: string;
  categoriaId: number;
  prazoEntrega: number;
  unidadeTempoEntrega: TimeUnit;
  templateBaseId?: number; // Tornado opcional (?)
  status?: ServiceStatus;
  precoBase: number;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

export interface ServiceResponseDto {
  id: number;
  nome: string;
  descricao: string;
  categoria: CategoryResponseDto;
  prazoEntrega: number;
  unidadeTempoEntrega: TimeUnit;
  templateBase?: TemplateResponseDto; // Tornado opcional
  status: ServiceStatus;
  precoBase: number;
  createdAt: Date;
  updatedAt: Date;
}