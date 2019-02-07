export interface Tag {
  Id: string;
  TagName: string;
}

export function generateMockTag(): Tag {
  return {
    Id: '1234',
    TagName: '12345'
  };
}
