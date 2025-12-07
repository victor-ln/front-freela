import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ClientModalComponent,
  Client,
} from '../../components/shared/client-modal/client-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import {
  FilterBarComponent,
  SelectFilter,
} from '../../components/shared/filter-bar/filter-bar.component';
import { MockClientService } from '../../core/services/client.service';
import { ClientResponseDto } from '../../core/dto/client.dto';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ClientModalComponent,
    ConfirmModalComponent,
    FormsModule,
    FilterBarComponent,
  ],
  templateUrl: `./clients.component.html`,
  styleUrls: [`./clients.component.css`],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  isLoading = false;

  // Configuração para o FilterBarComponent
  searchFields: (keyof Client)[] = ['name', 'responsible', 'email', 'document'];
  selectFilters: SelectFilter[] = [
    {
      label: 'Todos os Status',
      model: 'status',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
      ],
    },
  ];

  isClientModalOpen = false;
  isConfirmModalOpen = false;
  isViewModalOpen = false;
  selectedClient: Client | null = null;
  clientToDelete: Client | null = null;

  constructor(private router: Router, private clientService: MockClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.clients = response.data.map(this.mapClientFromApi);
        this.filteredClients = [...this.clients];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.isLoading = false;
      }
    });
  }

  private mapClientFromApi(clientDto: ClientResponseDto): Client {
    return {
      id: clientDto.id.toString(),
      status: clientDto.status,
      name: clientDto.nomeRazaoSocial,
      responsible: clientDto.responsavel || '',
      phone: clientDto.telefonePrincipal,
      document: clientDto.cpfCnpj,
      email: clientDto.email,
      address: {
        cep: clientDto.endereco.cep,
        street: clientDto.endereco.ruaAvenida,
        number: clientDto.endereco.numero,
        complement: clientDto.endereco.complemento || '',
        neighborhood: clientDto.endereco.bairro,
        city: clientDto.endereco.cidade,
        state: clientDto.endereco.estado,
        country: clientDto.endereco.pais,
      },
    };
  }

  handleFilteredData(data: Client[]): void {
    this.filteredClients = data;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  hasActiveSubRoute(): boolean {
    return this.router.url !== '/clients';
  }

  openNewClientModal() {
    this.selectedClient = null;
    this.isClientModalOpen = true;
  }

  openEditClientModal(client: Client) {
    this.selectedClient = { ...client };
    this.isClientModalOpen = true;
  }

  openViewClientModal(client: Client) {
    this.selectedClient = { ...client };
    this.isViewModalOpen = true;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
    this.isViewModalOpen = false;
    this.selectedClient = null;
  }

  handleClientSaved(client: Client) {
    const clientDto = {
      status: client.status,
      nomeRazaoSocial: client.name,
      responsavel: client.responsible,
      telefonePrincipal: client.phone,
      cpfCnpj: client.document,
      email: client.email,
      endereco: {
        cep: client.address.cep,
        ruaAvenida: client.address.street,
        numero: client.address.number,
        complemento: client.address.complement,
        bairro: client.address.neighborhood,
        cidade: client.address.city,
        estado: client.address.state,
        pais: client.address.country,
      },
    };

    if (client.id && client.id !== 'new') {
      // Atualizar cliente existente
      const id = parseInt(client.id);
      this.clientService.update(id, clientDto).subscribe({
        next: () => {
          this.loadClients();
          this.closeClientModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
        }
      });
    } else {
      // Criar novo cliente
      this.clientService.create(clientDto).subscribe({
        next: () => {
          this.loadClients();
          this.closeClientModal();
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
        }
      });
    }
  }

  confirmDeleteClient(client: Client) {
    this.clientToDelete = client;
    this.isConfirmModalOpen = true;
  }

  deleteClientConfirmed() {
    if (this.clientToDelete && this.clientToDelete.id) {
      const id = parseInt(this.clientToDelete.id);
      this.clientService.remove(id).subscribe({
        next: () => {
          this.loadClients();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar cliente:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.clientToDelete = null;
  }
}
