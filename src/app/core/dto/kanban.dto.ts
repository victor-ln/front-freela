import { ProposalResponseDto } from './proposal.dto';

export interface CreateKanbanDto {
  titulo: string;
  descricao?: string;
  propostaId: number;
  colunas?: string[];
}

export interface UpdateKanbanDto extends Partial<CreateKanbanDto> {}

export interface KanbanResponseDto {
  id: number;
  titulo: string;
  descricao?: string;
  proposta: ProposalResponseDto;
  colunas: string[];
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}