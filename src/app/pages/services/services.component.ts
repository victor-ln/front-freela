import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceModalComponent, Service } from '../../components/shared/service-modal/service-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { FilterBarComponent, SelectFilter } from '../../components/shared/filter-bar/filter-bar.component';
import { MockServiceService } from '../../core/services/mock/mock-service.service';
import { MockCategoryService } from '../../core/services/mock/mock-category.service';
import { TemplateService } from '../../core/services/template.service';
import { ServiceResponseDto } from '../../core/dto/service.dto';
import { CategoryResponseDto } from '../../core/dto/category.dto';
import { TemplateResponseDto } from '../../core/dto/template.dto';
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
  categories: CategoryResponseDto[] = [];
  templates: TemplateResponseDto[] = [];
  isLoading = false;

  searchFields: (keyof Service)[] = ['name', 'description'];
  selectFilters: SelectFilter[] = [
    {
      label: 'Todas as Categorias',
      model: 'category',
      options: [], // Será populado dinamicamente
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

  constructor(
    private serviceService: MockServiceService,
    private categoryService: MockCategoryService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.loadDependencies();
    this.loadServices();
  }

  loadDependencies(): void {
    // Carregar Categorias
    this.categoryService.findAllActive().subscribe({
      next: (data) => {
        this.categories = data;
        const catFilter = this.selectFilters.find(f => f.model === 'category');
        if (catFilter) {
          catFilter.options = data.map(c => ({ value: c.tipo, label: c.tipo }));
        }
      },
      error: (err) => console.error('Erro ao carregar categorias', err)
    });

    // Carregar Templates
    this.templateService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.templates = response.data;
      },
      error: (err) => console.error('Erro ao carregar templates', err)
    });
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
      categoryId: serviceDto.categoria.id,
      deliveryTime: serviceDto.prazoEntrega,
      timeUnit: serviceDto.unidadeTempoEntrega,
      templateBase: serviceDto.templateBase?.nome || '',
      templateBaseId: serviceDto.templateBase?.id,
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

  handleServiceSaved(service: Service) {
    const serviceDto = {
      nome: service.name,
      descricao: service.description,
      categoriaId: service.categoryId!, // ID vindo do modal
      prazoEntrega: service.deliveryTime,
      unidadeTempoEntrega: service.timeUnit as TimeUnit,
      templateBaseId: service.templateBaseId, // Pode ser undefined (opcional no DTO agora)
      precoBase: service.basePrice,
      status: service.status === 'active' ? ServiceStatus.ATIVO : ServiceStatus.INATIVO,
    };

    if (service.id && service.id.length < 10) { // Verifica se é ID numérico do backend
      const id = parseInt(service.id);
      this.serviceService.update(id, serviceDto).subscribe({
        next: () => {
          this.loadServices();
          this.closeServiceModal();
        },
        error: (error) => console.error('Erro ao atualizar serviço:', error)
      });
    } else {
      this.serviceService.create(serviceDto).subscribe({
        next: () => {
          this.loadServices();
          this.closeServiceModal();
        },
        error: (error) => console.error('Erro ao criar serviço:', error)
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