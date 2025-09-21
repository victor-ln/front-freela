import { ClientResponseDto } from './client.dto';
import { SocialNetworksTypeResponseDto } from './social-network-type.dto';

export interface CreateSocialNetworkDto {
  nome: string;
  url: string;
  tipoId: number;
  clienteId: number;
}

export interface UpdateSocialNetworkDto extends Partial<Omit<CreateSocialNetworkDto, 'clienteId'>> {}

export interface SocialNetworkResponseDto {
  id: number;
  nome: string;
  url: string;
  tipo: SocialNetworksTypeResponseDto;
  cliente: ClientResponseDto;
  createdAt: Date;
  updatedAt: Date;
}