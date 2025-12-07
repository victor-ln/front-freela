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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  currentStep = 1;
  totalSteps = 2;

  estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

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

  formatCpfCnpj(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
      // Formatar como CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formatar como CNPJ: 00.000.000/0000-00
      value = value.substring(0, 14);
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }

    event.target.value = value;
    this.registerForm.patchValue({ cpfCnpj: value });
  }

  formatCep(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 8);
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    event.target.value = value;
    this.registerForm.patchValue({ cep: value });
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Fields = ['nome', 'email', 'cpfCnpj', 'senha'];
      const step1Valid = step1Fields.every(field => {
        const control = this.registerForm.get(field);
        return control && control.valid;
      });

      if (step1Valid) {
        this.currentStep = 2;
        this.errorMessage = null;
      } else {
        step1Fields.forEach(field => {
          this.registerForm.get(field)?.markAsTouched();
        });
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = null;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
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
      cpfCnpj: formValue.cpfCnpj, // Backend aceita formatado
      endereco: {
        cep: formValue.cep, // Backend exige formato XXXXX-XXX
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
        this.successMessage = 'Registro realizado com sucesso! Você será redirecionado para o login.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocorreu um erro no registro. Verifique os dados e tente novamente.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}