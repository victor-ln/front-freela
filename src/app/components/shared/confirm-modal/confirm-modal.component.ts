import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: `confirm-modal.component.html`,
  styleUrl: `confirm-modal.component.css`
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar Ação';
  @Input() confirmTitle = 'Tem certeza?';
  @Input() message = 'Esta ação não pode ser desfeita.';
  @Input() details = '';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() isProcessing = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    if (!this.isProcessing) {
      this.confirmed.emit();
    }
  }

  onCancel() {
    if (!this.isProcessing) {
      this.cancelled.emit();
      this.onModalClose();
    }
  }

  onModalClose() {
    this.closed.emit();
  }
}