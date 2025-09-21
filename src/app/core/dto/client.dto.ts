import { CreateAddressDto, AddressResponseDto, UpdateAddressDto } from './address.dto';

export interface CreateClientDto {
  status: string;
  nomeRazaoSocial: string;
  responsavel?: string;
  telefonePrincipal: string;
  telefoneSecundario?: string;
  cpfCnpj: string;
  email: string;
  endereco: CreateAddressDto;
}

export interface UpdateClientDto extends Partial<Omit<CreateClientDto, 'endereco'>> {
  endereco?: UpdateAddressDto;
}

export interface ClientResponseDto {
  id: number;
  status: string;
  nomeRazaoSocial: string;
  responsavel?: string;
  telefonePrincipal: string;
  telefoneSecundario?: string;
  cpfCnpj: string;
  email: string;
  endereco: AddressResponseDto;
  createdAt: Date;
  updatedAt: Date;
}