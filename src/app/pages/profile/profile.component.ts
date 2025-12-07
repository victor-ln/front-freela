import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { FreelancerService } from '../../core/services/freelancer.service';
import { ClientService } from '../../core/services/client.service';
import { ProposalService } from '../../core/services/proposal.service';
import { FreelancerResponseDto } from '../../core/dto/freelancer.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: `./profile.component.html`,
  styleUrl: `./profile.component.css`
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  isConfirmModalOpen = false;
  isLoading = true;
  isSaving = false;

  profileData: FreelancerResponseDto | null = null;

  freelancerData = {
    name: '',
    email: '',
    document: '',
    phone: '',
    bio: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil'
    }
  };

  settings = {
    emailProposals: true,
    emailAcceptance: true,
    weeklyReports: false,
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    twoFactorAuth: false
  };

  profileStats = {
    totalClients: 0,
    totalProposals: 0,
    totalRevenue: 0
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    private freelancerService: FreelancerService,
    private clientService: ClientService,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStats();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.freelancerService.getProfile().subscribe({
      next: (profile) => {
        this.profileData = profile;
        this.freelancerData = {
          name: profile.nome,
          email: profile.email,
          document: profile.cpfCnpj,
          phone: '',
          bio: '',
          address: {
            cep: profile.endereco.cep,
            street: profile.endereco.ruaAvenida,
            number: profile.endereco.numero,
            complement: profile.endereco.complemento || '',
            neighborhood: profile.endereco.bairro,
            city: profile.endereco.cidade,
            state: profile.endereco.estado,
            country: profile.endereco.pais
          }
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.isLoading = false;
      }
    });
  }

  loadStats(): void {
    // Carregar total de clientes
    this.clientService.findAll({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        this.profileStats.totalClients = response.meta.totalItems;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas de clientes:', error);
      }
    });

    // Carregar total de propostas
    this.proposalService.findAll({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        this.profileStats.totalProposals = response.meta.totalItems;

        // Calcular receita total (soma de todas as propostas aceitas)
        // TODO: Backend deveria ter endpoint específico para isso
        this.profileStats.totalRevenue = 0; // Por enquanto
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas de propostas:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(): string {
    if (!this.freelancerData.name) return '??';
    return this.freelancerData.name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  changeAvatar(): void {
    // TODO: Implementar upload de avatar
    console.log('Funcionalidade de upload de avatar ainda não implementada');
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('A nova senha e a confirmação não coincidem');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    this.freelancerService.changePassword({
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    }).subscribe({
      next: (response) => {
        alert(response.message || 'Senha alterada com sucesso!');
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        alert(error.error?.message || 'Erro ao alterar senha');
        console.error('Erro ao alterar senha:', error);
      }
    });
  }

  deleteAccount(): void {
    this.isConfirmModalOpen = true;
  }

  deleteAccountConfirmed(): void {
    // TODO: Implementar exclusão de conta via API
    console.log('Funcionalidade de exclusão de conta ainda não implementada no backend');
    this.closeConfirmModal();
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
  }

  cancelChanges(): void {
    this.loadProfile(); // Recarregar dados originais
  }

  saveChanges(): void {
    this.isSaving = true;

    const updateDto = {
      nome: this.freelancerData.name,
      email: this.freelancerData.email,
      cpfCnpj: this.freelancerData.document,
      endereco: {
        cep: this.freelancerData.address.cep,
        ruaAvenida: this.freelancerData.address.street,
        numero: this.freelancerData.address.number,
        complemento: this.freelancerData.address.complement || undefined,
        bairro: this.freelancerData.address.neighborhood,
        cidade: this.freelancerData.address.city,
        estado: this.freelancerData.address.state,
        pais: this.freelancerData.address.country
      }
    };

    this.freelancerService.updateProfile(updateDto).subscribe({
      next: (response) => {
        alert('Perfil atualizado com sucesso!');
        this.profileData = response;
        this.isSaving = false;
      },
      error: (error) => {
        alert('Erro ao atualizar perfil');
        console.error('Erro ao atualizar perfil:', error);
        this.isSaving = false;
      }
    });
  }
}