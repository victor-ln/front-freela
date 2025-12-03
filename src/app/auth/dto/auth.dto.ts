// DTO para o corpo da requisição de login, conforme /auth/dto/sign-in.dto.ts
export interface SignInDto {
  username: string; // O BFF espera 'username', não 'email', para o login.
  password: string;
}

// DTO para a resposta do login bem-sucedido
export interface AuthResponse {
  access_token: string;
}

// Enum para as Roles, conforme /auth/roles/roles.enum.ts
export enum Role {
  ADMIN = 'Admin',
  FREELANCER_PREMIUM = 'Freelancer Premium',
  FREELANCER = 'Freelancer',
}

// Payload decodificado do JWT, conforme /auth/strategies/jwt.strategy.ts
export interface JwtPayload {
  sub: number; // User ID
  username: string;
  roles?: Role[];
  iat?: number; // Issued at
  exp?: number; // Expiration time
}