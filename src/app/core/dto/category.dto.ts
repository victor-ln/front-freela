export interface CreateCategoryDto {
  tipo: string;
  status?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CategoryResponseDto {
  id: number;
  tipo: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}