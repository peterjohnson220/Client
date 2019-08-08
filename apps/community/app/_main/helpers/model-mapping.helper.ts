import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { Tag } from '../models/tag.model';
import { FilterOptions } from '../models/filter-options.model';
import { TagFilter } from '../models/tag-filter.model';
import { CategoryFilter } from '../models/category-filter.model';
import { CommunityTag } from 'libs/models/community/community-tag.model';
import { PagingOptions } from '../models/paging-options.model';
import { IndustryFilter } from '../models/industry-filter.model';
import { CompanySizeFilter } from '../models/company-size-filter.model';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';
import { Topic } from '../models/topic.model';
import { TopicFilter } from '../models/topic-filter.model';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';

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
  const topics: Topic[] = [];
  const filterOptions: FilterOptions = {
    TagFilter: initializeTagFilter(tags),
    CategoryFilter: initializeCategoryFilter(),
    IndustryFilter: initializeIndustryFilter(),
    CompanySizeFilter: initializeCompanySizeFilter(),
    TopicFilter: initializeTopicFilter(topics),
    PostIds: [],
    ReplyIds: []
  };
  return filterOptions;
}
export function initializeTagFilter(tags: Tag[]): TagFilter {
  const tagFilter: TagFilter =  {
    Tags: tags,
    IncludeReplies: true
  };
  return tagFilter;
}

export function initializeCategoryFilter(): CategoryFilter {
  const categoryFilters: CommunityCategoryEnum[] = [];
  return {
    Category: categoryFilters
  };
}

export function initializeIndustryFilter(): IndustryFilter {
  const industryFilters: CommunityIndustry[] = [];
  return {
    Industries: industryFilters
  };
}

export function initializeCompanySizeFilter(): CompanySizeFilter {
  const companySizes: CommunityCompanySize[] = [];
  return {
    CompanySizes: companySizes
  };
}

export function initializeTopicFilter(topics: Topic[]): TopicFilter {
  const topicFilter: TopicFilter =  {
    Topics: topics
  };
  return topicFilter;
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

export function populatePostReplies(post: any, addReplies: string[], filterReplies: string[], replies) {
  if (post.ReplyIds && post.ReplyIds.length > 0) {
    const filteredReplyIds = post.ReplyIds.filter(replyId => addReplies.indexOf(replyId) < 0
      && filterReplies.indexOf(replyId) < 0);
    const filteredReplies = filteredReplyIds.reduce((acc, id) => {
      return replies[id] ? [...acc, replies[id]] : acc;
    }, []);
    post.ReplyCount = filteredReplies.length;
    filteredReplies.forEach(filteredReply => {
      post.Replies.push(filteredReply);
    });
  }
}

