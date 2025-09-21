export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface PaginationDto {
  page?: number;
  limit?: number;
  search?: string;
}