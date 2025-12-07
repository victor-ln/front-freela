import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { FreelancerService } from '../../../core/services/freelancer.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: `./header.component.html`,
    styleUrl: `./header.component.css`
})
export class HeaderComponent implements OnInit {
  userName: string = '';

  constructor(
    private authService: AuthService,
    private freelancerService: FreelancerService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.freelancerService.getProfile().subscribe({
      next: (profile) => {
        this.userName = profile.nome;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário no header:', error);
      }
    });
  }

  getInitials(): string {
    if (!this.userName) return 'FL'; // Fallback padrão
    return this.userName
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}