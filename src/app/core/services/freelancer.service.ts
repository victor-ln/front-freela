import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FreelancerResponseDto, UpdateFreelancerDto, ChangePasswordDto } from '../dto/freelancer.dto';

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private readonly apiUrl = `${environment.apiUrl}/freelancers`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Obter perfil do freelancer logado
   * GET /freelancers/profile
   */
  getProfile(): Observable<FreelancerResponseDto> {
    return this.http.get<FreelancerResponseDto>(`${this.apiUrl}/profile`);
  }

  /**
   * Atualizar perfil do freelancer logado
   * PATCH /freelancers/profile
   */
  updateProfile(updateDto: UpdateFreelancerDto): Observable<FreelancerResponseDto> {
    return this.http.patch<FreelancerResponseDto>(`${this.apiUrl}/profile`, updateDto);
  }

  /**
   * Alterar senha do freelancer logado
   * PATCH /freelancers/change-password
   */
  changePassword(changePasswordDto: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/change-password`, changePasswordDto);
  }

  /**
   * Obtém o ID do freelancer logado a partir do token JWT
   * Por enquanto retorna 1 como fallback (para desenvolvimento)
   */
  getCurrentFreelancerId(): number {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.freelancerId || 1;
      } catch {
        return 1;
      }
    }
    return 1;
  }
}
