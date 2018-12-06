import { TagFilter } from './tag-filter.model';
import { CategoryFilter } from './category-filter.model';

export interface FilterOptions {
  TagFilter: TagFilter;
  CategoryFilter: CategoryFilter;
  PostIds: string[];
  ReplyIds: string[];
}
