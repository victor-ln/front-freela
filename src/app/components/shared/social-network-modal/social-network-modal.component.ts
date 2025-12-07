import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MockClientService } from '../../../core/services/mock/mock-client.service';
import { MockSocialNetworkTypeService } from '../../../core/services/mock/mock-social-network-type.service';
import { ClientResponseDto } from '../../../core/dto/client.dto';
import { SocialNetworksTypeResponseDto } from '../../../core/dto/social-network-type.dto';

export interface SocialNetwork {
  id: string;
  clientName: string;
  name: string;
  url: string;
  type: string;
}

@Component({
    selector: 'app-social-network-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
    templateUrl: `social-network-modal.component.html`,
    styleUrl: `social-network-modal.component.css`
})
export class SocialNetworkModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() socialNetwork: SocialNetwork | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() socialNetworkSaved = new EventEmitter<SocialNetwork>();

  socialNetworkForm!: FormGroup;
  isSubmitting = false;
  clients: ClientResponseDto[] = [];
  socialNetworkTypes: SocialNetworksTypeResponseDto[] = [];
  isLoadingClients = false;
  isLoadingTypes = false;

  constructor(
    private fb: FormBuilder,
    private clientService: MockClientService,
    private socialNetworkTypeService: MockSocialNetworkTypeService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.loadClients();
    this.loadSocialNetworkTypes();
  }

  ngOnChanges() {
    if (this.socialNetwork && this.socialNetworkForm) {
      this.populateForm();
    } else if (!this.socialNetwork && this.socialNetworkForm) {
      this.resetForm();
    }
  }

  private initForm() {
    this.socialNetworkForm = this.fb.group({
      clientName: ['', Validators.required],
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      url: ['', [Validators.required, this.urlValidator]]
    });
  }

  private urlValidator(control: any) {
    const url = control.value;
    if (!url) return null;
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url) ? null : { url: true };
  }

  private populateForm() {
    if (this.socialNetwork) {
      this.socialNetworkForm.patchValue({
        clientName: this.socialNetwork.clientName,
        type: this.socialNetwork.type,
        name: this.socialNetwork.name,
        url: this.socialNetwork.url
      });
    }
  }

  private resetForm() {
    this.socialNetworkForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.socialNetworkForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.socialNetworkForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.socialNetworkForm.value;
      
      const socialNetworkData: SocialNetwork = {
        id: this.socialNetwork?.id || this.generateId(),
        clientName: formValue.clientName,
        type: formValue.type,
        name: formValue.name,
        url: formValue.url
      };

      // Simulate API call
      setTimeout(() => {
        this.socialNetworkSaved.emit(socialNetworkData);
        this.isSubmitting = false;
        this.onModalClose();
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.socialNetworkForm.controls).forEach(key => {
        this.socialNetworkForm.get(key)?.markAsTouched();
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

  private loadSocialNetworkTypes(): void {
    this.isLoadingTypes = true;
    this.socialNetworkTypeService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.socialNetworkTypes = response.data;
        this.isLoadingTypes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de rede social:', error);
        this.isLoadingTypes = false;
      }
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}