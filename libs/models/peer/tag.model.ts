export interface Tag {
  TagId: number;
  TagCategoryId: number;
  Value: string;
  Selected: boolean;
  New: boolean;
}

export function generateMockTag(): Tag {
  return {
    TagId: 1,
    TagCategoryId: 1,
    Value: 'Tag',
    Selected: false,
    New: false
  };
}
