import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
// import { ClientService } from '../../../core/services/client.service';
import { MockClientService as ClientService } from '../../../core/services/mock/mock-client.service';
// import { ProposalService } from '../../../core/services/proposal.service';
import { MockProposalService as ProposalService } from '../../../core/services/mock/mock-proposal.service';
import { ClientResponseDto } from '../../../core/dto/client.dto';
import { ProposalResponseDto } from '../../../core/dto/proposal.dto';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  proposal: string;
  client: string;
}

@Component({
    selector: 'app-task-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `task-modal.component.html`,
    styleUrl: `task-modal.component.css`
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Input() isViewMode = false;

  @Output() closed = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<Task>();

  taskForm!: FormGroup;
  isSubmitting = false;
  clients: ClientResponseDto[] = [];
  proposals: ProposalResponseDto[] = [];
  isLoadingClients = false;
  isLoadingProposals = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private proposalService: ProposalService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.loadClients();
    this.loadProposals();
  }

  ngOnChanges() {
    if (this.task && this.taskForm) {
      this.populateForm();
    } else if (!this.task && this.taskForm) {
      this.resetForm();
    }
    this.toggleFormControls(this.isViewMode);
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      client: [''],
      proposal: [''],
      priority: ['medium'],
      status: ['a-fazer'],
      startDate: [''],
      dueDate: ['', Validators.required]
    });
  }

  private populateForm() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        client: this.task.client,
        proposal: this.task.proposal,
        priority: this.task.priority,
        status: this.task.status,
        startDate: this.task.startDate ? this.formatDateForInput(this.task.startDate) : '',
        dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : ''
      });
    }
  }

  private toggleFormControls(disable: boolean) {
    if (this.taskForm) {
      for (const key in this.taskForm.controls) {
        if (this.taskForm.controls.hasOwnProperty(key)) {
          if (disable) {
            this.taskForm.controls[key].disable();
          } else {
            this.taskForm.controls[key].enable();
          }
        }
      }
    }
  }

  private resetForm() {
    this.taskForm.reset({
      priority: 'medium',
      status: 'a-fazer'
    });
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.isViewMode) return;
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.taskForm.getRawValue();
      
      const taskData: Task = {
        id: this.task?.id || this.generateId(),
        title: formValue.title,
        description: formValue.description,
        client: formValue.client,
        proposal: formValue.proposal,
        priority: formValue.priority,
        status: formValue.status,
        startDate: formValue.startDate ? new Date(formValue.startDate) : undefined,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
      };

      setTimeout(() => {
        this.taskSaved.emit(taskData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
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

  private loadProposals(): void {
    this.isLoadingProposals = true;
    this.proposalService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.proposals = response.data;
        this.isLoadingProposals = false;
      },
      error: (error) => {
        console.error('Erro ao carregar propostas:', error);
        this.isLoadingProposals = false;
      }
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}