import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SocialNetworkModalComponent,
  SocialNetwork,
} from '../../../components/shared/social-network-modal/social-network-modal.component';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal/confirm-modal.component';
import {
  FilterBarComponent,
  SelectFilter,
} from '../../../components/shared/filter-bar/filter-bar.component';
import { SocialNetworkService } from '../../../core/services/social-network.service';
import { SocialNetworkResponseDto } from '../../../core/dto/social-network.dto';

@Component({
  selector: 'app-social-networks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SocialNetworkModalComponent,
    ConfirmModalComponent,
    FilterBarComponent,
  ],
  templateUrl: `./social-networks.component.html`,
  styleUrls: [`./social-networks.component.css`],
})
export class SocialNetworksComponent implements OnInit {
  socialNetworks: SocialNetwork[] = [];
  filteredSocialNetworks: SocialNetwork[] = [];
  isLoading = false;

  searchFields: (keyof SocialNetwork)[] = ['name', 'clientName', 'url'];
  selectFilters: SelectFilter[] = [];

  isSocialNetworkModalOpen = false;
  isConfirmModalOpen = false;
  selectedSocialNetwork: SocialNetwork | null = null;
  socialNetworkToDelete: SocialNetwork | null = null;

  constructor(private socialNetworkService: SocialNetworkService) {}

  ngOnInit(): void {
    this.loadSocialNetworks();
  }

  loadSocialNetworks(): void {
    this.isLoading = true;
    this.socialNetworkService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.socialNetworks = response.data.map(this.mapSocialNetworkFromApi);
        this.filteredSocialNetworks = [...this.socialNetworks];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar redes sociais:', error);
        this.isLoading = false;
      }
    });
  }

  private mapSocialNetworkFromApi(dto: SocialNetworkResponseDto): SocialNetwork {
    return {
      id: dto.id.toString(),
      clientName: dto.cliente.nomeRazaoSocial,
      name: dto.nome,
      type: dto.tipo.tipo,
      url: dto.url,
    };
  }

  handleFilteredData(data: SocialNetwork[]): void {
    this.filteredSocialNetworks = data;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getNetworkIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Facebook:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      Instagram:
        '<svg viewBox="0 0 24 24" fill="currentColor"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      LinkedIn:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
      Twitter:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
    };

    return icons[type] || '';
  }

  openNewSocialNetworkModal() {
    this.selectedSocialNetwork = null;
    this.isSocialNetworkModalOpen = true;
  }

  openEditSocialNetworkModal(socialNetwork: SocialNetwork) {
    this.selectedSocialNetwork = { ...socialNetwork };
    this.isSocialNetworkModalOpen = true;
  }

  closeSocialNetworkModal() {
    this.isSocialNetworkModalOpen = false;
    this.selectedSocialNetwork = null;
  }

  handleSocialNetworkSaved(socialNetwork: any) {
    // TODO: Modal precisa enviar clienteId e tipoId
    const dto = {
      nome: socialNetwork.name,
      url: socialNetwork.url,
      tipoId: socialNetwork.tipoId || 1, // TODO: Ajustar modal
      clienteId: socialNetwork.clienteId || 1, // TODO: Ajustar modal
    };

    if (socialNetwork.id && socialNetwork.id !== 'new') {
      const id = parseInt(socialNetwork.id);
      this.socialNetworkService.update(id, dto).subscribe({
        next: () => {
          this.loadSocialNetworks();
          this.closeSocialNetworkModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar rede social:', error);
        }
      });
    } else {
      this.socialNetworkService.create(dto).subscribe({
        next: () => {
          this.loadSocialNetworks();
          this.closeSocialNetworkModal();
        },
        error: (error) => {
          console.error('Erro ao criar rede social:', error);
        }
      });
    }
  }

  confirmDeleteSocialNetwork(socialNetwork: SocialNetwork) {
    this.socialNetworkToDelete = socialNetwork;
    this.isConfirmModalOpen = true;
  }

  deleteSocialNetworkConfirmed() {
    if (this.socialNetworkToDelete && this.socialNetworkToDelete.id) {
      const id = parseInt(this.socialNetworkToDelete.id);
      this.socialNetworkService.remove(id).subscribe({
        next: () => {
          this.loadSocialNetworks();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar rede social:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.socialNetworkToDelete = null;
  }
}
