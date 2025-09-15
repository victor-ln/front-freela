import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: `./clients.component.html`,
  styleUrl: `./clients.component.css`
})
export class ClientsComponent {
  mockClients = [
    {
      name: 'Empresa ABC Ltda',
      document: '12.345.678/0001-90',
      responsible: 'João Silva',
      email: 'joao@empresaabc.com',
      phone: '(11) 99999-8888',
      status: 'active'
    },
    {
      name: 'Startup XYZ',
      document: '98.765.432/0001-10',
      responsible: 'Maria Santos',
      email: 'maria@startupxyz.com',
      phone: '(11) 88888-7777',
      status: 'active'
    },
    {
      name: 'Loja 123',
      document: '456.789.123-45',
      responsible: 'Pedro Costa',
      email: 'pedro@loja123.com',
      phone: '(11) 77777-6666',
      status: 'inactive'
    }
  ];

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  hasActiveSubRoute(): boolean {
    // Esta função será melhorada quando implementarmos as subrotas
    return false;
  }
}