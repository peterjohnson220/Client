import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { Tag } from '../models/tag.model';
import { FilterOptions } from '../models/filter-options.model';
import { TagFilter } from '../models/tag-filter.model';
import { CategoryFilter } from '../models/category-filter.model';
import { CommunityTag } from 'libs/models/community/community-tag.model';
import { PagingOptions } from '../models/paging-options.model';

export function mapResultsPagingOptionsToPagingOptions(resultsPagingOptions: PagingOptions): PagingOptions {
  return {
    PageIndex: resultsPagingOptions.PageIndex,
    NumberOfPosts: resultsPagingOptions.NumberOfPosts
  };
}

export function mapCommunityTagToTag(communityTag: CommunityTag): Tag {
  return  {
    Id: communityTag.Id,
    TagName: communityTag.Tag
  };
}

export function initializeFilterOptions(): FilterOptions {
  const tags: Tag[] = [];
  return {
    TagFilter: initializeTagFilter(tags),
    CategoryFilter: initializeCategoryFilter(),
    PostIds: [],
    ReplyIds: []
  };
}
export function initializeTagFilter(tags: Tag[]): TagFilter {
  return  {
    Tags: tags,
    IncludeReplies: true
  };
}

export function initializeCategoryFilter(): CategoryFilter {
  const categoryFilters: CommunityCategoryEnum[] = [];
  return {
    Category: categoryFilters
  };
}

export function mapToCategoryEnum(category: string): CommunityCategoryEnum {
  switch (category) {
    case 'MyPosts':
      return CommunityCategoryEnum.MyPosts;
    case 'Internal':
      return CommunityCategoryEnum.Internal;
    case 'Unanswered':
      return CommunityCategoryEnum.Unanswered;
    default:
      return CommunityCategoryEnum.MyPosts;
  }

}

