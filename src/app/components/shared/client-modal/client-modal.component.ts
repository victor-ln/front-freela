import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

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
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: `client-modal.component.html`,
  styleUrl: `client-modal.component.css`,
})
export class ClientModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() client: Client | null = null;
  @Input() isViewMode = false;

  @Output() closed = new EventEmitter<void>();
  @Output() clientSaved = new EventEmitter<Client>();

  clientForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
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
      phone: ['', Validators.required],
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
        phone: this.client.phone,
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
      
      const clientData: Client = {
        id: this.client?.id || this.generateId(),
        status: formValue.status,
        name: formValue.name,
        responsible: formValue.responsible,
        phone: formValue.phone,
        document: formValue.document,
        email: formValue.email,
        address: {
          cep: formValue.cep,
          street: formValue.street,
          number: formValue.number,
          complement: formValue.complement,
          neighborhood: formValue.neighborhood,
          city: formValue.city,
          state: formValue.state,
          country: formValue.country
        }
      };

      setTimeout(() => {
        this.clientSaved.emit(clientData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
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