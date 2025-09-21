import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `modal.component.html`,
  styleUrl: `modal.component.css`,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Input() closeOnOverlayClick = true;
  @Input() closeOnEscape = true;

  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    // Prevent body scroll when modal is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent) {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.close();
    }
  }

  private handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.closed.emit();
  }
}