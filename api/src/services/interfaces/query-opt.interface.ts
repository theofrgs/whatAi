export interface QueryOpt {
  page?: number;
  perPage?: number;
  searchBy?: Record<string, any>;
  sortBy?: Record<string, string>;
  select?: string[];
  relations?: string[];
}
