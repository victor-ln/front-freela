import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { CategoryResponseDto } from '../../../core/dto/category.dto';
import { TemplateResponseDto } from '../../../core/dto/template.dto';
import { MockCategoryService } from '../../../core/services/mock/mock-category.service';
import { MockTemplateService } from '../../../core/services/mock/mock-template.service';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId?: number;
  deliveryTime: number;
  timeUnit: string;
  templateBase: string;
  templateBaseId?: number;
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
  categories: CategoryResponseDto[] = [];
  templates: TemplateResponseDto[] = [];
  isLoadingCategories = false;
  isLoadingTemplates = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: MockCategoryService,
    private templateService: MockTemplateService
  ) { this.initForm(); }

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.loadTemplates();
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
      description: ['', [Validators.required]],
      categoryId: ['', Validators.required],
      deliveryTime: ['', [Validators.required]],
      timeUnit: ['', Validators.required],
      templateBaseId: [''],
      status: ['active', Validators.required],
      basePrice: ['', [Validators.required]]
    });
  }

  private populateForm() {
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        description: this.service.description,
        categoryId: this.service.categoryId,
        deliveryTime: this.service.deliveryTime,
        timeUnit: this.service.timeUnit,
        templateBaseId: this.service.templateBaseId,
        status: this.service.status,
        basePrice: this.service.basePrice
      });
    }
  }

  private resetForm() {
    this.serviceForm.reset({ status: 'active', categoryId: '', templateBaseId: '' });
  }

  isFieldInvalid(name: string): boolean {
    const f = this.serviceForm.get(name);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit() {
    if (this.serviceForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const val = this.serviceForm.value;
      
      const cat = this.categories.find(c => c.id == val.categoryId);
      const tmpl = this.templates.find(t => t.id == val.templateBaseId);

      this.serviceSaved.emit({
        id: this.service?.id || '',
        name: val.name,
        description: val.description,
        category: cat ? cat.tipo : '',
        categoryId: val.categoryId,
        deliveryTime: val.deliveryTime,
        timeUnit: val.timeUnit,
        templateBase: tmpl ? tmpl.nome : '',
        templateBaseId: val.templateBaseId ? Number(val.templateBaseId) : undefined,
        status: val.status,
        basePrice: val.basePrice
      });
      this.isSubmitting = false;
      this.onModalClose();
    } else {
      this.serviceForm.markAllAsTouched();
    }
  }

  onCancel() { this.onModalClose(); }
  onModalClose() { this.resetForm(); this.isSubmitting = false; this.closed.emit(); }

  private loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoryService.findAllActive().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.isLoadingCategories = false;
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
}