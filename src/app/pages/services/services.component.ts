import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ServiceModalComponent,
  Service,
} from '../../components/shared/service-modal/service-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import {
  FilterBarComponent,
  SelectFilter,
} from '../../components/shared/filter-bar/filter-bar.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    ServiceModalComponent,
    ConfirmModalComponent,
    FilterBarComponent,
  ],
  templateUrl: `./services.component.html`,
  styleUrls: [`./services.component.css`],
})
export class ServicesComponent implements OnInit {
  mockServices: Service[] = [
    {
      id: '1',
      name: 'Desenvolvimento de Website',
      description:
        'Criação de websites responsivos e modernos com as melhores tecnologias do mercado.',
      category: 'Desenvolvimento',
      deliveryTime: 15,
      timeUnit: 'dias',
      templateBase: 'Contrato Desenvolvimento Web',
      basePrice: 5500,
      status: 'active',
    },
    {
      id: '2',
      name: 'Design de Identidade Visual',
      description:
        'Criação completa de identidade visual incluindo logo, cores, tipografia e manual de marca.',
      category: 'Design',
      deliveryTime: 10,
      timeUnit: 'dias',
      templateBase: 'Contrato Design Gráfico',
      basePrice: 2800,
      status: 'active',
    },
    {
      id: '3',
      name: 'Aplicativo Mobile',
      description:
        'Desenvolvimento de aplicativos nativos para iOS e Android com design moderno.',
      category: 'Desenvolvimento',
      deliveryTime: 30,
      timeUnit: 'dias',
      templateBase: 'Contrato App Mobile',
      basePrice: 12000,
      status: 'active',
    },
    {
      id: '4',
      name: 'Consultoria em UX',
      description:
        'Análise e otimização da experiência do usuário em produtos digitais.',
      category: 'Consultoria',
      deliveryTime: 5,
      timeUnit: 'dias',
      templateBase: 'Contrato Consultoria',
      basePrice: 3500,
      status: 'active',
    },
    {
      id: '5',
      name: 'E-commerce Completo',
      description:
        'Loja virtual completa com sistema de pagamento, gestão de produtos e painel administrativo.',
      category: 'Desenvolvimento',
      deliveryTime: 45,
      timeUnit: 'dias',
      templateBase: '',
      basePrice: 18000,
      status: 'inactive',
    },
  ];

  filteredServices: Service[] = [];

  // Configuração para o FilterBarComponent
  searchFields: (keyof Service)[] = ['name', 'description'];
  selectFilters: SelectFilter[] = [
    {
      label: 'Todas as Categorias',
      model: 'category',
      options: [
        { value: 'Desenvolvimento', label: 'Desenvolvimento' },
        { value: 'Design', label: 'Design' },
        { value: 'Consultoria', label: 'Consultoria' },
      ],
    },
    {
      label: 'Todos os Status',
      model: 'status',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
      ],
    },
  ];

  isServiceModalOpen = false;
  isConfirmModalOpen = false;
  selectedService: Service | null = null;
  serviceToDelete: Service | null = null;

  ngOnInit(): void {
    this.filteredServices = [...this.mockServices];
  }

  handleFilteredData(data: Service[]): void {
    this.filteredServices = data;
  }

  openNewServiceModal() {
    this.selectedService = null;
    this.isServiceModalOpen = true;
  }

  openEditServiceModal(service: Service) {
    this.selectedService = { ...service };
    this.isServiceModalOpen = true;
  }

  closeServiceModal() {
    this.isServiceModalOpen = false;
    this.selectedService = null;
  }

  handleServiceSaved(service: Service) {
    const index = this.mockServices.findIndex((s) => s.id === service.id);
    if (index > -1) {
      this.mockServices[index] = service;
    } else {
      this.mockServices.unshift(service);
    }
    this.handleFilteredData(this.mockServices);
    this.closeServiceModal();
  }

  confirmDeleteService(service: Service) {
    this.serviceToDelete = service;
    this.isConfirmModalOpen = true;
  }

  deleteServiceConfirmed() {
    if (this.serviceToDelete) {
      this.mockServices = this.mockServices.filter(
        (s) => s.id !== this.serviceToDelete!.id
      );
      this.handleFilteredData(this.mockServices);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.serviceToDelete = null;
  }
}