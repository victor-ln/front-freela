import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

export interface Category {
  id: string;
  type: string;
  status: string;
}

@Component({
    selector: 'app-category-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: './category-modal.component.html',
    styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() category: Category | null = null;
  
  @Output() closed = new EventEmitter<void>();
  @Output() categorySaved = new EventEmitter<Category>();

  categoryForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.category && this.categoryForm) {
      this.populateForm();
    } else if (!this.category && this.categoryForm) {
      this.resetForm();
    }
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      status: ['active', Validators.required]
    });
  }

  private populateForm() {
    if (this.category) {
      this.categoryForm.patchValue({
        type: this.category.type,
        status: this.category.status
      });
    }
  }

  private resetForm() {
    this.categoryForm.reset({
      status: 'active'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.categoryForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.categoryForm.value;
      
      const categoryData: Category = {
        id: this.category?.id || this.generateId(),
        type: formValue.type,
        status: formValue.status
      };

      // Simulate API call
      setTimeout(() => {
        this.categorySaved.emit(categoryData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
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