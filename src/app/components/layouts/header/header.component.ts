import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: `./header.component.html`,
    styleUrl: `./header.component.css`
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}