import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  deliveryTime: number;
  timeUnit: string;
  templateBase: string;
  status: string;
  basePrice: number;
}

@Component({
    selector: 'app-service-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `service-modal.component.html`,
    styleUrl: `service-modal.component.css`
})
export class ServiceModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() service: Service | null = null;
  
  @Output() closed = new EventEmitter<void>();
  @Output() serviceSaved = new EventEmitter<Service>();

  serviceForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.service && this.serviceForm) {
      this.populateForm();
    } else if (!this.service && this.serviceForm) {
      this.resetForm();
    }
  }

  private initForm() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      deliveryTime: ['', [Validators.required, Validators.min(1)]],
      timeUnit: ['', Validators.required],
      templateBase: [''],
      status: ['active', Validators.required],
      basePrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  private populateForm() {
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        description: this.service.description,
        category: this.service.category,
        deliveryTime: this.service.deliveryTime,
        timeUnit: this.service.timeUnit,
        templateBase: this.service.templateBase,
        status: this.service.status,
        basePrice: this.service.basePrice
      });
    }
  }

  private resetForm() {
    this.serviceForm.reset({
      status: 'active'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.serviceForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.serviceForm.value;
      
      const serviceData: Service = {
        id: this.service?.id || this.generateId(),
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        deliveryTime: formValue.deliveryTime,
        timeUnit: formValue.timeUnit,
        templateBase: formValue.templateBase,
        status: formValue.status,
        basePrice: formValue.basePrice
      };

      // Simulate API call
      setTimeout(() => {
        this.serviceSaved.emit(serviceData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.serviceForm.controls).forEach(key => {
        this.serviceForm.get(key)?.markAsTouched();
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