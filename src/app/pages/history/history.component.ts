import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../components/shared/proposal/proposal.component';
import { ProposalService } from '../../core/services/proposal.service';
import { ProposalResponseDto } from '../../core/dto/proposal.dto';
import { ProposalStatus } from '../../core/enums/proposal-status.enum';

@Component({
    selector: 'app-history',
    imports: [CommonModule],
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  completedProposals: Proposal[] = [];
  isLoading = false;

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    this.loadCompletedProposals();
  }

  loadCompletedProposals(): void {
    this.isLoading = true;
    this.proposalService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        // Filtra apenas propostas aceitas
        const acceptedProposals = response.data
          .filter(p => p.status === ProposalStatus.ACCEPTED)
          .map(this.mapProposalFromApi);
        this.completedProposals = acceptedProposals;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
        this.isLoading = false;
      }
    });
  }

  private mapProposalFromApi(proposalDto: ProposalResponseDto): Proposal {
    return {
      id: proposalDto.id.toString(),
      title: proposalDto.titulo,
      clientName: proposalDto.cliente.nomeRazaoSocial,
      description: proposalDto.descricao,
      services: proposalDto.servicos.map(s => s.nome),
      template: proposalDto.template.nome,
      totalValue: proposalDto.valorTotal,
      status: 'accepted',
      createdAt: new Date(proposalDto.createdAt),
      updatedAt: new Date(proposalDto.updatedAt),
    };
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
