import { Role } from '../enums/roles.enum'; // Supondo que você criará um enum para Roles
import { CreateAddressDto, AddressResponseDto, UpdateAddressDto } from './address.dto';

export interface CreateFreelancerDto {
  nome: string;
  email: string;
  senha: string;
  cpfCnpj: string;
  endereco: CreateAddressDto;
  roles?: Role[];
}

export interface UpdateFreelancerDto extends Partial<Omit<CreateFreelancerDto, 'senha' | 'endereco'>> {
  endereco?: UpdateAddressDto;
}

export interface FreelancerResponseDto {
  id: number;
  nome: string;
  email: string;
  cpfCnpj: string;
  ativo: boolean;
  endereco: AddressResponseDto;
  roles: Role[];
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}