export interface SaveWorkbookTagObj {
  WorkbookId: string;
  Tag: string;
}

export function generateMockSaveWorkbookTagObj(): SaveWorkbookTagObj {
  return {
    WorkbookId: 'd6205351-cbab-465b-a14f-67a3bed9afbf',
    Tag: 'Structures'
  };
}
