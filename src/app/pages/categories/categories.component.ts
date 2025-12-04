import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryModalComponent, Category } from '../../components/shared/category-modal/category-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { CategoryService } from '../../core/services/category.service';
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

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.isLoading = false;
      }
    });
  }

  getCategoryIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Desenvolvimento': '<svg viewBox="0 0 24 24" fill="currentColor"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Design': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
      'Consultoria': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      'Marketing': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/><path d="M5.5 4A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 4"/><path d="M9 9h6v6H9z"/></svg>'
    };
    
    return icons[type] || '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>';
  }

  openNewCategoryModal() {
    this.selectedCategory = null;
    this.isCategoryModalOpen = true;
  }

  openEditCategoryModal(category: CategoryResponseDto) {
    this.selectedCategory = {
      id: category.id.toString(),
      type: category.tipo,
      status: category.status ? 'active' : 'inactive'
    };
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal() {
    this.isCategoryModalOpen = false;
    this.selectedCategory = null;
  }

  handleCategorySaved(category: Category) {
    const categoryDto = {
      tipo: category.type,
      status: category.status === 'active'
    };

    if (this.selectedCategory?.id) {
      // Atualizar categoria existente
      const id = parseInt(this.selectedCategory.id);
      this.categoryService.update(id, categoryDto).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar categoria:', error);
        }
      });
    } else {
      // Criar nova categoria
      this.categoryService.create(categoryDto).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
        }
      });
    }
  }

  confirmDeleteCategory(category: CategoryResponseDto) {
    this.categoryToDelete = category;
    this.isConfirmModalOpen = true;
  }

  deleteCategoryConfirmed() {
    if (this.categoryToDelete) {
      this.categoryService.remove(this.categoryToDelete.id).subscribe({
        next: () => {
          this.loadCategories();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar categoria:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.categoryToDelete = null;
  }
}