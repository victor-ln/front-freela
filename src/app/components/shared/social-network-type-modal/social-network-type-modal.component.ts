import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

export interface SocialNetworkType {
  id: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-social-network-type-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: `social-network-type-modal.component.html`,
  styleUrl: `social-network-type-modal.component.css`,
})
export class SocialNetworkTypeModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() socialNetworkType: SocialNetworkType | null = null;
  
  @Output() closed = new EventEmitter<void>();
  @Output() socialNetworkTypeSaved = new EventEmitter<SocialNetworkType>();

  socialNetworkTypeForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.socialNetworkType && this.socialNetworkTypeForm) {
      this.populateForm();
    } else if (!this.socialNetworkType && this.socialNetworkTypeForm) {
      this.resetForm();
    }
  }

  private initForm() {
    this.socialNetworkTypeForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      status: ['active', Validators.required]
    });
  }

  private populateForm() {
    if (this.socialNetworkType) {
      this.socialNetworkTypeForm.patchValue({
        type: this.socialNetworkType.type,
        status: this.socialNetworkType.status
      });
    }
  }

  private resetForm() {
    this.socialNetworkTypeForm.reset({
      status: 'active'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.socialNetworkTypeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.socialNetworkTypeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.socialNetworkTypeForm.value;
      
      const socialNetworkTypeData: SocialNetworkType = {
        id: this.socialNetworkType?.id || this.generateId(),
        type: formValue.type,
        status: formValue.status
      };

      // Simulate API call
      setTimeout(() => {
        this.socialNetworkTypeSaved.emit(socialNetworkTypeData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.socialNetworkTypeForm.controls).forEach(key => {
        this.socialNetworkTypeForm.get(key)?.markAsTouched();
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