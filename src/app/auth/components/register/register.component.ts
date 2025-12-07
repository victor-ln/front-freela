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
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      cpfCnpj: ['', Validators.required],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      ruaAvenida: ['', [Validators.required, Validators.minLength(5)]],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      pais: ['Brasil', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.registerForm.value;

    const formData = {
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      cpfCnpj: formValue.cpfCnpj,
      endereco: {
        cep: formValue.cep,
        ruaAvenida: formValue.ruaAvenida,
        numero: formValue.numero,
        complemento: formValue.complemento || undefined,
        bairro: formValue.bairro,
        cidade: formValue.cidade,
        estado: formValue.estado,
        pais: formValue.pais,
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