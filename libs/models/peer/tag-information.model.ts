import { generateMockTag, Tag } from './tag.model';
import { FilterType } from '../../features/search/search/models';
import {TagCategoryDataTypeEnum} from './tag-category-data-type.enum';

export interface TagInformation {
  TagCategoryId: number;
  DisplayName: string;
  Tags: Tag[];
  IsCategoryInExchange: boolean;
  SelectedTags: Tag[];
  DataType: TagCategoryDataTypeEnum;
}

export function generateMockTagInformation(): TagInformation {
  return {
    TagCategoryId: 1,
    DisplayName: 'Display Name',
    Tags: [ generateMockTag() ],
    IsCategoryInExchange: true,
    SelectedTags: [ generateMockTag() ],
    DataType: TagCategoryDataTypeEnum.Text
  };
}
