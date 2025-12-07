import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MockServiceService } from '../../../core/services/mock/mock-service.service';
import { MockClientService } from '../../../core/services/mock/mock-client.service';
import { MockTemplateService } from '../../../core/services/mock/mock-template.service';
import { ServiceResponseDto } from '../../../core/dto/service.dto';
import { ClientResponseDto } from '../../../core/dto/client.dto';
import { TemplateResponseDto } from '../../../core/dto/template.dto';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  clientName: string;
  services: string[];
  template?: string;
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
  selectedServices: string[] = [];
  availableServices: string[] = [];
  clients: ClientResponseDto[] = [];
  templates: TemplateResponseDto[] = [];
  isLoadingServices = false;
  isLoadingClients = false;
  isLoadingTemplates = false;

  constructor(
    private fb: FormBuilder,
    private serviceService: MockServiceService,
    private clientService: MockClientService,
    private templateService: MockTemplateService
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
      clientName: ['', Validators.required],
      template: [''],
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
        clientName: this.proposal.clientName,
        template: this.proposal.template,
        totalValue: this.proposal.totalValue,
        status: this.proposal.status
      });
      
      this.selectedServices = [...this.proposal.services];
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

  onServiceChange(service: string, event: Event) {
    if (this.isViewMode) return;
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
    this.proposalForm.get('services')?.markAsTouched();
  }

  removeService(service: string) {
    if (this.isViewMode) return;
    this.selectedServices = this.selectedServices.filter(s => s !== service);
  }

  onSubmit() {
    if (this.isViewMode) return;
    const isFormValid = this.proposalForm.valid && this.selectedServices.length > 0;
    
    if (isFormValid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.proposalForm.getRawValue();
      
      const proposalData: Proposal = {
        id: this.proposal?.id || this.generateId(),
        title: formValue.title,
        description: formValue.description,
        clientName: formValue.clientName,
        services: [...this.selectedServices],
        template: formValue.template,
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
        this.availableServices = services.map(service => service.nome);
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