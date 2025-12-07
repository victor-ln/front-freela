import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryModalComponent, Category } from '../../components/shared/category-modal/category-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { MockCategoryService } from '../../core/services/mock/mock-category.service';
import { CategoryResponseDto } from '../../core/dto/category.dto';

@Component({
    selector: 'app-categories',
    imports: [CommonModule, CategoryModalComponent, ConfirmModalComponent],
    templateUrl: `categories.component.html`,
    styleUrl: `categories.component.css`
})
export class CategoriesComponent implements OnInit {
  categories: CategoryResponseDto[] = [];
  isLoading = false;

  isCategoryModalOpen = false;
  isConfirmModalOpen = false;
  selectedCategory: Category | null = null;
  categoryToDelete: CategoryResponseDto | null = null;

  constructor(private categoryService: MockCategoryService) {}
dummy
