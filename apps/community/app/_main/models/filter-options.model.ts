import { TagFilter } from './tag-filter.model';
import { CategoryFilter } from './category-filter.model';
import { IndustryFilter } from './industry-filter.model';

export interface FilterOptions {
  TagFilter: TagFilter;
  CategoryFilter: CategoryFilter;
  IndustryFilter: IndustryFilter;
  PostIds: string[];
  ReplyIds: string[];
}
