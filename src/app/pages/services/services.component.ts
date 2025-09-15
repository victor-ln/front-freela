import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./services.component.html`,
  styleUrl: `./services.component.css`,
})
export class ServicesComponent {
  mockServices = [
    {
      name: 'Desenvolvimento de Website',
      description: 'Criação de websites responsivos e modernos com as melhores tecnologias do mercado.',
      category: 'Desenvolvimento',
      deliveryTime: 15,
      timeUnit: 'dias',
      template: 'Contrato Desenvolvimento Web',
      basePrice: 5500,
      status: 'active',
      proposalsCount: 8
    },
    {
      name: 'Design de Identidade Visual',
      description: 'Criação completa de identidade visual incluindo logo, cores, tipografia e manual de marca.',
      category: 'Design',
      deliveryTime: 10,
      timeUnit: 'dias',
      template: 'Contrato Design Gráfico',
      basePrice: 2800,
      status: 'active',
      proposalsCount: 12
    },
    {
      name: 'Aplicativo Mobile',
      description: 'Desenvolvimento de aplicativos nativos para iOS e Android com design moderno.',
      category: 'Desenvolvimento',
      deliveryTime: 30,
      timeUnit: 'dias',
      template: 'Contrato App Mobile',
      basePrice: 12000,
      status: 'active',
      proposalsCount: 3
    },
    {
      name: 'Consultoria em UX',
      description: 'Análise e otimização da experiência do usuário em produtos digitais.',
      category: 'Consultoria',
      deliveryTime: 5,
      timeUnit: 'dias',
      template: 'Contrato Consultoria',
      basePrice: 3500,
      status: 'active',
      proposalsCount: 6
    },
    {
      name: 'E-commerce Completo',
      description: 'Loja virtual completa com sistema de pagamento, gestão de produtos e painel administrativo.',
      category: 'Desenvolvimento',
      deliveryTime: 45,
      timeUnit: 'dias',
      template: null,
      basePrice: 18000,
      status: 'inactive',
      proposalsCount: 1
    }
  ];
}