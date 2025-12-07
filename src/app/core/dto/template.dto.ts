import { TemplateStatus } from '../enums/template-status.enum';

export interface CreateTemplateDto {
  nome: string;
  anexo: string; // URL ou caminho do arquivo
  status?: TemplateStatus;
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface ApproveTemplateDto {
    status: TemplateStatus;
    comentario?: string;
}

export interface TemplateResponseDto {
  id: number;
  nome: string;
  anexo: string;
  status: TemplateStatus;
  dataCriacao: Date; // Data de criação do template
  dataAtualizacao: Date; // Data de última atualização
  createdAt: Date;
  updatedAt: Date;
}