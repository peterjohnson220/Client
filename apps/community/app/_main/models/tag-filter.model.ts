import { Tag } from './tag.model';

export interface TagFilter {
  Tags: Tag[];
  IncludeReplies: boolean;
}
