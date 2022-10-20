export interface IPaginatedResult {
  docs: any;
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages?: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter?: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}
