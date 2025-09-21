import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

export interface Template {
  id: string;
  name: string;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  variables: string[];
  fileAttachment?: File;
}

@Component({
    selector: 'app-template-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `template-modal.component.html`,
    styleUrl: `template-modal.component.css`
})
export class TemplateModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() template: Template | null = null;
  
  @Output() closed = new EventEmitter<void>();
  @Output() templateSaved = new EventEmitter<Template>();

  templateForm!: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  isFileRequired = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.template && this.templateForm) {
      this.populateForm();
    } else if (!this.template && this.templateForm) {
      this.resetForm();
    }
  }

  private initForm() {
    this.templateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      status: [{value: 'review', disabled: true}]
    });
  }

  private populateForm() {
    if (this.template) {
      this.templateForm.patchValue({
        name: this.template.name,
        type: this.template.type,
        status: this.template.status
      });
      
      // Enable status field for existing templates
      this.templateForm.get('status')?.enable();
    }
  }

  private resetForm() {
    this.templateForm.reset({
      status: 'review'
    });
    this.templateForm.get('status')?.disable();
    this.selectedFile = null;
    this.isFileRequired = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.templateForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onSubmit() {
    // Check file requirement for new templates
    this.isFileRequired = !this.template?.id;
    
    const isFormValid = this.templateForm.valid && (this.selectedFile || this.template?.id);
    
    if (isFormValid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.templateForm.value;
      
      const templateData: Template = {
        id: this.template?.id || this.generateId(),
        name: formValue.name,
        type: formValue.type,
        status: this.template?.id ? formValue.status : 'review',
        createdAt: this.template?.createdAt || new Date(),
        updatedAt: new Date(),
        usageCount: this.template?.usageCount || 0,
        variables: this.template?.variables || [],
        fileAttachment: this.selectedFile || undefined
      };

      // Simulate API call
      setTimeout(() => {
        this.templateSaved.emit(templateData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.templateForm.controls).forEach(key => {
        this.templateForm.get(key)?.markAsTouched();
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