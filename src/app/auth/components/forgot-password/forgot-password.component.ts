import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.css'] // Reutiliza o CSS do login
})
export class ForgotPasswordComponent {
  recoveryForm: FormGroup;
  message: string | null = null;
  isError = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.message = null;

    this.authService.forgotPassword(this.recoveryForm.value.email).subscribe({
      next: () => {
        this.isError = false;
        this.message = 'Se um conta com este e-mail existir, um link de recuperação foi enviado.';
        this.isSubmitting = false;
        this.recoveryForm.reset();
      },
      error: (err) => {
        this.isError = false; // Mesmo em erro, mostramos a mensagem de sucesso por segurança
        this.message = 'Se um conta com este e-mail existir, um link de recuperação foi enviado.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}