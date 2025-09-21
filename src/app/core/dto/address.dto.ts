export interface CreateAddressDto {
  cep: string;
  ruaAvenida: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

export interface AddressResponseDto {
  id: number;
  cep: string;
  ruaAvenida: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  createdAt: Date;
  updatedAt: Date;
}