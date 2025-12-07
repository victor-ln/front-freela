import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { ProposalService } from '../../core/services/proposal.service';
import { ProposalResponseDto } from '../../core/dto/proposal.dto';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: `./dashboard.component.html`,
    styleUrl: `./dashboard.component.css`
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalClientes: 0,
    projetosAtivos: 0,
    propostasPendentes: 0,
    receitaMensal: 0
  };

  recentProposals: ProposalResponseDto[] = [];
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Carregar estatísticas do dashboard
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        this.isLoading = false;
      }
    });

    // Carregar propostas recentes (últimas 3)
    this.proposalService.findAll({ page: 1, limit: 3 }).subscribe({
      next: (response) => {
        this.recentProposals = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar propostas recentes:', error);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getProposalStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendente',
      'SENT': 'Enviada',
      'ACCEPTED': 'Aceita',
      'CANCELED': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getProposalStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'PENDING': 'pending',
      'SENT': 'pending',
      'ACCEPTED': 'accepted',
      'CANCELED': 'rejected'
    };
    return classMap[status] || 'pending';
  }
}