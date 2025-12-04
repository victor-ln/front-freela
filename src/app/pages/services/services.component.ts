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
import { ServiceService } from '../../core/services/service.service';
import { ServiceResponseDto } from '../../core/dto/service.dto';
import { ServiceStatus } from '../../core/enums/service-status.enum';
import { TimeUnit } from '../../core/enums/time-unit.enum';

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
  services: Service[] = [];
  filteredServices: Service[] = [];
  isLoading = false;

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

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.services = response.data.map(this.mapServiceFromApi);
        this.filteredServices = [...this.services];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
        this.isLoading = false;
      }
    });
  }

  private mapServiceFromApi(serviceDto: ServiceResponseDto): Service {
    return {
      id: serviceDto.id.toString(),
      name: serviceDto.nome,
      description: serviceDto.descricao,
      category: serviceDto.categoria.tipo,
      deliveryTime: serviceDto.prazoEntrega,
      timeUnit: serviceDto.unidadeTempoEntrega,
      templateBase: serviceDto.templateBase?.nome || '',
      basePrice: serviceDto.precoBase,
      status: serviceDto.status === ServiceStatus.ATIVO ? 'active' : 'inactive',
    };
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

  handleServiceSaved(service: any) {
    // TODO: O modal precisa enviar categoriaId e templateBaseId ao invés de strings
    // Por enquanto, esta implementação espera que o modal já envie os dados corretos
    const serviceDto = {
      nome: service.name,
      descricao: service.description,
      categoriaId: service.categoryId || parseInt(service.category), // TODO: Ajustar modal
      prazoEntrega: service.deliveryTime,
      unidadeTempoEntrega: service.timeUnit as TimeUnit,
      templateBaseId: service.templateBaseId || 1, // TODO: Ajustar modal
      precoBase: service.basePrice,
      status: service.status === 'active' ? ServiceStatus.ATIVO : ServiceStatus.INATIVO,
    };

    if (service.id && service.id !== 'new') {
      // Atualizar serviço existente
      const id = parseInt(service.id);
      this.serviceService.update(id, serviceDto).subscribe({
        next: () => {
          this.loadServices();
          this.closeServiceModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar serviço:', error);
        }
      });
    } else {
      // Criar novo serviço
      this.serviceService.create(serviceDto).subscribe({
        next: () => {
          this.loadServices();
          this.closeServiceModal();
        },
        error: (error) => {
          console.error('Erro ao criar serviço:', error);
        }
      });
    }
  }

  confirmDeleteService(service: Service) {
    this.serviceToDelete = service;
    this.isConfirmModalOpen = true;
  }

  deleteServiceConfirmed() {
    if (this.serviceToDelete && this.serviceToDelete.id) {
      const id = parseInt(this.serviceToDelete.id);
      this.serviceService.remove(id).subscribe({
        next: () => {
          this.loadServices();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar serviço:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.serviceToDelete = null;
  }
}