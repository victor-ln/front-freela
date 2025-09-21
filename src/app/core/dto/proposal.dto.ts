import { ContractStatus } from '../enums/contract-status.enum';
import { ProposalStatus } from '../enums/proposal-status.enum';
import { ClientResponseDto } from './client.dto';
import { ServiceResponseDto } from './service.dto';
import { TemplateResponseDto } from './template.dto';

export interface CreateProposalDto {
  titulo: string;
  descricao: string;
  clienteId: number;
  servicosIds: number[];
  templateId: number;
  valorTotal: number;
  status?: ProposalStatus;
  observacoes?: string;
}

export interface UpdateProposalDto extends Partial<CreateProposalDto> {}

export interface AcceptProposalDto {
    evidenciaAceite: string; // URL ou caminho da evidência
}

export interface GenerateContractDto {
    observacoesContrato?: string;
}

export interface SendEmailDto {
    emailDestinatario: string;
    assunto: string;
    mensagem: string;
    contratoPersonalizado?: string;
}

export interface ProposalResponseDto {
  id: number;
  titulo: string;
  descricao: string;
  cliente: ClientResponseDto;
  servicos: ServiceResponseDto[];
  template: TemplateResponseDto;
  valorTotal: number;
  status: ProposalStatus;
  contratoStatus: ContractStatus;
  observacoes?: string;
  evidenciaAceite?: string;
  contratoGerado?: string;
  contratoEditado?: string;
  dataEdicaoContrato?: Date;
  emailEnviado?: boolean;
  dataEnvioEmail?: Date;
  createdAt: Date;
  updatedAt: Date;
}