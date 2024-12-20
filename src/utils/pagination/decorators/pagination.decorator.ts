import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const page = +request.query.page || 1;
    const orderBy = request.query.orderBy || null;
    const orderDirection = request.query.order === 'desc' ? 'desc' : 'asc';
    const perPage = +request.query.perPage || 10;
    return {
      page,
      perPage,
      orderBy,
      orderDirection,
    };
  },
);
