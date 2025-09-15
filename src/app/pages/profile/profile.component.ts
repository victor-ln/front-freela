import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./profile.component.html`,
  styleUrl: `./profile.component.css`
})
export class ProfileComponent {
  activeTab = 'personal';

  freelancerData = {
    name: 'João Silva',
    email: 'joao@freelaflow.com',
    phone: '(11) 99999-8888',
    document: '123.456.789-00',
    bio: 'Desenvolvedor Full Stack com mais de 5 anos de experiência em projetos web e mobile. Especialista em Angular, Node.js e desenvolvimento de APIs RESTful.',
    address: {
      cep: '01234-567',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apt 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
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
    totalClients: 15,
    totalProposals: 47,
    totalRevenue: 125400
  };

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(): string {
    return this.freelancerData.name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}