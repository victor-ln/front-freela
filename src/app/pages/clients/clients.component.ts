import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ClientModalComponent, Client } from '../../components/shared/client-modal/client-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-clients',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ClientModalComponent, ConfirmModalComponent],
    templateUrl: `./clients.component.html`,
    styleUrl: `./clients.component.css`
})
export class ClientsComponent {
  mockClients: Client[] = [
    {
      id: '1',
      status: 'active',
      name: 'Empresa ABC Ltda',
      responsible: 'João Silva',
      phone: '(11) 99999-8888',
      document: '12.345.678/0001-90',
      email: 'joao@empresaabc.com',
      address: {
        cep: '01234-567',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Sala 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil'
      }
    },
    {
      id: '2',
      status: 'active',
      name: 'Startup XYZ',
      responsible: 'Maria Santos',
      phone: '(11) 88888-7777',
      document: '98.765.432/0001-10',
      email: 'maria@startupxyz.com',
      address: {
        cep: '04567-890',
        street: 'Avenida Paulista',
        number: '456',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil'
      }
    },
    {
      id: '3',
      status: 'inactive',
      name: 'Loja 123',
      responsible: 'Pedro Costa',
      phone: '(11) 77777-6666',
      document: '456.789.123-45',
      email: 'pedro@loja123.com',
      address: {
        cep: '05678-901',
        street: 'Rua Augusta',
        number: '789',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil'
      }
    }
  ];

  // Modal states
  isClientModalOpen = false;
  isConfirmModalOpen = false;
  selectedClient: Client | null = null;
  clientToDelete: Client | null = null;

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  hasActiveSubRoute(): boolean {
    // This will be improved when sub-routes are implemented
    return false;
  }

  viewClient(client: Client): void {
    console.log('Visualizando cliente:', client);
    // Logic to show client details, maybe in a modal or a separate page
  }

  // Modal methods
  openNewClientModal() {
    this.selectedClient = null;
    this.isClientModalOpen = true;
  }

  openEditClientModal(client: Client) {
    this.selectedClient = { ...client };
    this.isClientModalOpen = true;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
    this.selectedClient = null;
  }

  handleClientSaved(client: Client) {
    if (this.selectedClient?.id) {
      // Update existing client
      const index = this.mockClients.findIndex(c => c.id === client.id);
      if (index > -1) {
        this.mockClients[index] = client;
      }
    } else {
      // Add new client
      this.mockClients.push(client);
    }
    this.closeClientModal();
  }

  confirmDeleteClient(client: Client) {
    this.clientToDelete = client;
    this.isConfirmModalOpen = true;
  }

  deleteClientConfirmed() {
    if (this.clientToDelete) {
      this.mockClients = this.mockClients.filter(c => c.id !== this.clientToDelete!.id);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.clientToDelete = null;
  }
}