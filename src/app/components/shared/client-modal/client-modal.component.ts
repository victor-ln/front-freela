import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MockClientService } from '../../../core/services/mock/mock-client.service';
import { ClientResponseDto, CreateClientDto, UpdateClientDto } from '../../../core/dto/client.dto';

export interface Client {
  id: string;
  status: string;
  name: string;
  responsible: string;
  phone: string;
  document: string;
  email: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
}

@Component({
    selector: 'app-client-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `client-modal.component.html`,
    styleUrl: `client-modal.component.css`
})
export class ClientModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() client: Client | null = null;
  @Input() isViewMode = false;

  @Output() closed = new EventEmitter<void>();
  @Output() clientSaved = new EventEmitter<Client>();

  clientForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: MockClientService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.client && this.clientForm) {
      this.populateForm();
    } else if (!this.client && this.clientForm) {
      this.resetForm();
    }
    this.toggleFormControls(this.isViewMode);
  }

  private initForm() {
    this.clientForm = this.fb.group({
      status: ['active', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      responsible: [''],
      primaryPhone: ['', Validators.required],
      secondaryPhone: [''],
      document: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['Brasil', Validators.required]
    });
  }

  private populateForm() {
    if (this.client) {
      this.clientForm.patchValue({
        status: this.client.status,
        name: this.client.name,
        responsible: this.client.responsible,
        primaryPhone: this.client.phone,
        secondaryPhone: '',
        document: this.client.document,
        email: this.client.email,
        cep: this.client.address.cep,
        street: this.client.address.street,
        number: this.client.address.number,
        complement: this.client.address.complement,
        neighborhood: this.client.address.neighborhood,
        city: this.client.address.city,
        state: this.client.address.state,
        country: this.client.address.country
      });
    }
  }

  private toggleFormControls(disable: boolean) {
    if (this.clientForm) {
      for (const key in this.clientForm.controls) {
        if (this.clientForm.controls.hasOwnProperty(key)) {
          if (disable) {
            this.clientForm.controls[key].disable();
          } else {
            this.clientForm.controls[key].enable();
          }
        }
      }
    }
  }

  private resetForm() {
    this.clientForm.reset({
      status: 'active',
      country: 'Brasil'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.isViewMode) return;
    if (this.clientForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.clientForm.getRawValue();

      if (this.client?.id) {
        // Atualizar cliente existente
        const updateDto: UpdateClientDto = {
          status: formValue.status,
          nomeRazaoSocial: formValue.name,
          responsavel: formValue.responsible,
          telefonePrincipal: formValue.primaryPhone,
          telefoneSecundario: formValue.secondaryPhone || undefined,
          cpfCnpj: formValue.document,
          email: formValue.email,
          endereco: {
            cep: formValue.cep,
            ruaAvenida: formValue.street,
            numero: formValue.number,
            complemento: formValue.complement || undefined,
            bairro: formValue.neighborhood,
            cidade: formValue.city,
            estado: formValue.state,
            pais: formValue.country
          }
        };

        this.clientService.update(Number(this.client.id), updateDto).subscribe({
          next: (response) => {
            const clientData: Client = {
              id: response.id.toString(),
              status: response.status,
              name: response.nomeRazaoSocial,
              responsible: response.responsavel || '',
              phone: response.telefonePrincipal,
              document: response.cpfCnpj,
              email: response.email,
              address: {
                cep: response.endereco.cep,
                street: response.endereco.ruaAvenida,
                number: response.endereco.numero,
                complement: response.endereco.complemento,
                neighborhood: response.endereco.bairro,
                city: response.endereco.cidade,
                state: response.endereco.estado,
                country: response.endereco.pais
              }
            };
            this.clientSaved.emit(clientData);
            this.isSubmitting = false;
            this.onModalClose();
          },
          error: (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.isSubmitting = false;
          }
        });
      } else {
        // Criar novo cliente
        const createDto: CreateClientDto = {
          status: formValue.status,
          nomeRazaoSocial: formValue.name,
          responsavel: formValue.responsible || undefined,
          telefonePrincipal: formValue.primaryPhone,
          telefoneSecundario: formValue.secondaryPhone || undefined,
          cpfCnpj: formValue.document,
          email: formValue.email,
          endereco: {
            cep: formValue.cep,
            ruaAvenida: formValue.street,
            numero: formValue.number,
            complemento: formValue.complement || undefined,
            bairro: formValue.neighborhood,
            cidade: formValue.city,
            estado: formValue.state,
            pais: formValue.country
          }
        };

        this.clientService.create(createDto).subscribe({
          next: (response) => {
            const clientData: Client = {
              id: response.id.toString(),
              status: response.status,
              name: response.nomeRazaoSocial,
              responsible: response.responsavel || '',
              phone: response.telefonePrincipal,
              document: response.cpfCnpj,
              email: response.email,
              address: {
                cep: response.endereco.cep,
                street: response.endereco.ruaAvenida,
                number: response.endereco.numero,
                complement: response.endereco.complemento,
                neighborhood: response.endereco.bairro,
                city: response.endereco.cidade,
                state: response.endereco.estado,
                country: response.endereco.pais
              }
            };
            this.clientSaved.emit(clientData);
            this.isSubmitting = false;
            this.onModalClose();
          },
          error: (error) => {
            console.error('Erro ao criar cliente:', error);
            this.isSubmitting = false;
          }
        });
      }
    } else {
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
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

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}