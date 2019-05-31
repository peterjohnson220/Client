import { generateMockTag, Tag } from './tag.model';

export interface TagInformation {
  TagCategoryId: number;
  DisplayName: string;
  Tags: Tag[];
  IsCategoryInExchange: boolean;
  SelectedTags: Tag[];
}

export function generateMockTagInformation(): TagInformation {
  return {
    TagCategoryId: 1,
    DisplayName: 'Display Name',
    Tags: [ generateMockTag() ],
    IsCategoryInExchange: true,
    SelectedTags: [ generateMockTag() ]
  };
}
