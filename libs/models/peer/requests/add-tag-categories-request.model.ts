export interface AddTagCategoriesRequest {
  ExchangeId: number;
  TagCategoryIds: number[];
}

export function generateMockAddTagCategoriesRequest(): AddTagCategoriesRequest {
  return {
    ExchangeId: 1,
    TagCategoryIds: [1, 2]
  };
}
