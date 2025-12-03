import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Usando validação de email, mas o campo é 'username'
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}