import { TagFilter } from './tag-filter.model';
import { CategoryFilter } from './category-filter.model';
import { IndustryFilter } from './industry-filter.model';
import { CompanySizeFilter } from './company-size-filter.model';

export interface FilterOptions {
  TagFilter: TagFilter;
  CategoryFilter: CategoryFilter;
  IndustryFilter: IndustryFilter;
  CompanySizeFilter: CompanySizeFilter;
  PostIds: string[];
  ReplyIds: string[];
}
