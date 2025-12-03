import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Reutiliza o mesmo CSS do login
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      cpfCnpj: ['', Validators.required],
      // Os campos de endereço foram omitidos para simplicidade no registo inicial.
      // O ideal seria pedi-los num passo seguinte (onboarding).
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    // O DTO `CreateFreelancerDto` espera um objeto de endereço.
    // Como simplificamos o formulário, enviamos um objeto vazio ou com valores padrão.
    const formData = {
      ...this.registerForm.value,
      endereco: {
        cep: "00000-000",
        ruaAvenida: "N/A",
        numero: "0",
        bairro: "N/A",
        cidade: "N/A",
        estado: "SP",
        pais: "Brasil"
      }
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Registo realizado com sucesso! Você será redirecionado para o login.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocorreu um erro no registo. Verifique os dados e tente novamente.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}