import { PaginationDto } from '../dto';
import { IPaginatedResult } from '../interfaces/paginated-result.interface';

const paginationHelper = (
  search: String | string,
  page = 0,
  perPage = 0,
  project: Record<string, string | number>,
  filters?: string[],
) => {
  const records = [];
  filters.length > 0 &&
    search &&
    records.push({
      $match: {
        $or: filters.map((filter) => ({
          [filter]: { $regex: search, $options: 'i' },
        })),
      },
    });
  records.push({ $project: project });

  if (page >= 0 && perPage > 0) {
    records.push({ $skip: search ? 0 : page * perPage });
    records.push({ $limit: perPage });
  }

  return records;
};

const paginationResponse = async (
  { count, data },
  pagination: PaginationDto,
) => {
  const { perPage, page } = pagination;
  const { total } = count[0];

  const meta: IPaginatedResult = {
    docs: data,
    totalDocs: total || 1,
    limit: perPage,
    page: page,
    prevPage: null,
    nextPage: null,
    hasPrevPage: false,
    hasNextPage: false,
  };

  const totalPages = perPage > 0 ? Math.ceil(total / perPage) || 1 : null;
  meta.totalPages = totalPages;
  meta.pagingCounter = (page - 1) * perPage + 1;

  // Set prev page
  if (page > 1) {
    meta.hasPrevPage = true;
    meta.prevPage = page - 1;
  } else if (page == 1) {
    meta.hasPrevPage = false;
    meta.prevPage = null;
  }

  // Set next page
  if (page < totalPages) {
    meta.hasNextPage = true;
    meta.nextPage = page + 1;
  }

  if (perPage == 0) {
    meta.limit = 0;
    meta.totalPages = 1;
    meta.page = 1;
    meta.pagingCounter = 1;
  }

  return meta;
};

export { paginationHelper, paginationResponse };
