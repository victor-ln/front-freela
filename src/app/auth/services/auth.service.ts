import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, SignInDto } from '../dto/auth.dto';
import { CreateFreelancerDto } from '../../core/dto/freelancer.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'accessToken';

  // BehaviorSubject para emitir o estado de autenticação
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(registerDto: CreateFreelancerDto): Observable<any> {
    // Conforme freelancers.controller.ts -> POST /register
    return this.http.post(`${this.apiUrl}/freelancers/register`, registerDto);
  }

  login(signInDto: SignInDto): Observable<AuthResponse> {
    // Conforme auth.controller.ts -> POST /auth/login
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, signInDto).pipe(
      tap(response => {
        this.setToken(response.access_token);
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    // Assumindo a criação de um endpoint POST /auth/forgot-password no BFF
    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}