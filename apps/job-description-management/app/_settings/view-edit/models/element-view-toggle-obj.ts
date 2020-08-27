  export interface ElementViewToggleObj {
  ViewName: string;
  TemplateId: number;
  ElementId: number;
}

export function generateMockElementViewToggleObj(): ElementViewToggleObj {
  return {
   ViewName: 'Fake View',
   TemplateId: 33,
   ElementId: 1032
  };
}
