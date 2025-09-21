export interface CreateSocialNetworksTypeDto {
  tipo: string;
  status?: boolean;
}

export interface UpdateSocialNetworksTypeDto extends Partial<CreateSocialNetworksTypeDto> {}

export interface SocialNetworksTypeResponseDto {
  id: number;
  tipo: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}