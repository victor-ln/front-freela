import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ServiceService } from '../../../core/services/service.service';
import { ClientService } from '../../../core/services/client.service';
import { TemplateService } from '../../../core/services/template.service';
import { ServiceResponseDto } from '../../../core/dto/service.dto';
import { ClientResponseDto } from '../../../core/dto/client.dto';
import { TemplateResponseDto } from '../../../core/dto/template.dto';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientId?: number;
  services: string[];
  servicosIds?: number[];
  template?: string;
  templateId?: number;
  totalValue: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
}

@Component({
    selector: 'app-proposal-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `proposal.component.html`,
    styleUrl: `proposal.component.css`
})
export class ProposalModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() proposal: Proposal | null = null;
  @Input() isViewMode = false;

  @Output() closed = new EventEmitter<void>();
  @Output() proposalSaved = new EventEmitter<Proposal>();

  proposalForm!: FormGroup;
  isSubmitting = false;
  selectedServices: ServiceResponseDto[] = [];
  availableServices: ServiceResponseDto[] = [];
  clients: ClientResponseDto[] = [];
  templates: TemplateResponseDto[] = [];
  isLoadingServices = false;
  isLoadingClients = false;
  isLoadingTemplates = false;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private clientService: ClientService,
    private templateService: TemplateService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.loadServices();
    this.loadClients();
    this.loadTemplates();
  }

  ngOnChanges() {
    if (this.proposal && this.proposalForm) {
      this.populateForm();
    } else if (!this.proposal && this.proposalForm) {
      this.resetForm();
    }
    this.toggleFormControls(this.isViewMode);
  }

  private initForm() {
    this.proposalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      clientId: ['', Validators.required],
      templateId: [''],
      services: [''],
      totalValue: ['', [Validators.required, Validators.min(0)]],
      status: [{value: 'pending', disabled: true}]
    });
  }

  private populateForm() {
    if (this.proposal) {
      this.proposalForm.patchValue({
        title: this.proposal.title,
        description: this.proposal.description,
        clientId: this.proposal.clientId,
        templateId: this.proposal.templateId,
        totalValue: this.proposal.totalValue,
        status: this.proposal.status
      });

      // Reconstruir selectedServices baseado nos servicosIds se disponível
      if (this.proposal.servicosIds && this.availableServices.length > 0) {
        this.selectedServices = this.availableServices.filter(s =>
          this.proposal!.servicosIds!.includes(s.id)
        );
      }
      this.proposalForm.get('status')?.enable();
    }
  }

  private toggleFormControls(disable: boolean) {
    if (this.proposalForm) {
      for (const key in this.proposalForm.controls) {
        if (this.proposalForm.controls.hasOwnProperty(key)) {
          if (disable) {
            this.proposalForm.controls[key].disable();
          } else {
            this.proposalForm.controls[key].enable();
          }
        }
      }
    }
  }

  private resetForm() {
    this.proposalForm.reset({
      status: 'pending'
    });
    this.proposalForm.get('status')?.disable();
    this.selectedServices = [];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.proposalForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onServiceChange(service: ServiceResponseDto, event: Event) {
    if (this.isViewMode) return;
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s.id !== service.id);
    }
    this.proposalForm.get('services')?.markAsTouched();
  }

  removeService(service: ServiceResponseDto) {
    if (this.isViewMode) return;
    this.selectedServices = this.selectedServices.filter(s => s.id !== service.id);
  }

  isServiceSelected(service: ServiceResponseDto): boolean {
    return this.selectedServices.some(s => s.id === service.id);
  }

  onSubmit() {
    if (this.isViewMode) return;
    const isFormValid = this.proposalForm.valid && this.selectedServices.length > 0;

    if (isFormValid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.proposalForm.getRawValue();

      // Buscar o cliente selecionado para obter o nome
      const selectedClient = this.clients.find(c => c.id == formValue.clientId);
      const selectedTemplate = this.templates.find(t => t.id == formValue.templateId);

      const proposalData: Proposal = {
        id: this.proposal?.id || this.generateId(),
        title: formValue.title,
        description: formValue.description,
        clientId: parseInt(formValue.clientId),
        clientName: selectedClient?.nomeRazaoSocial || '',
        servicosIds: this.selectedServices.map(s => s.id),
        services: this.selectedServices.map(s => s.nome),
        templateId: formValue.templateId ? parseInt(formValue.templateId) : undefined,
        template: selectedTemplate?.nome,
        totalValue: formValue.totalValue,
        status: this.proposal?.id ? formValue.status : 'pending',
        createdAt: this.proposal?.createdAt || new Date(),
        updatedAt: new Date(),
        acceptedAt: this.proposal?.acceptedAt
      };

      setTimeout(() => {
        this.proposalSaved.emit(proposalData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      Object.keys(this.proposalForm.controls).forEach(key => {
        this.proposalForm.get(key)?.markAsTouched();
      });
      if (this.selectedServices.length === 0) {
        this.proposalForm.get('services')?.markAsTouched();
      }
    }
  }

  onCancel() {
    this.onModalClose();
  }

  onModalClose() {
    this.resetForm();
    this.isSubmitting = false;
    this.closed.emit();
  }

  private loadServices(): void {
    this.isLoadingServices = true;
    this.serviceService.findActive().subscribe({
      next: (services) => {
        this.availableServices = services;
        this.isLoadingServices = false;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
        this.isLoadingServices = false;
      }
    });
  }

  private loadClients(): void {
    this.isLoadingClients = true;
    this.clientService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.clients = response.data;
        this.isLoadingClients = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.isLoadingClients = false;
      }
    });
  }

  private loadTemplates(): void {
    this.isLoadingTemplates = true;
    this.templateService.findApproved().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.isLoadingTemplates = false;
      },
      error: (error) => {
        console.error('Erro ao carregar templates:', error);
        this.isLoadingTemplates = false;
      }
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}