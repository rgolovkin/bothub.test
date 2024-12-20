import { ApiHideProperty, ApiQuery } from '@nestjs/swagger';

export class PaginationDto {
  @ApiHideProperty()
  page: number;

  @ApiHideProperty()
  perPage: number;

  @ApiHideProperty()
  orderBy: string;

  @ApiHideProperty()
  orderDirection: 'DESC' | 'ASC';
}

export class PaginationResult<T> {
  content: T[];
  pagination: PaginationDto;
  totalElements: number;

  constructor(content: T[], totalElements: number, pageable: PaginationDto) {
    this.content = content;
    this.totalElements = totalElements;
    this.pagination = pageable;
  }
}
