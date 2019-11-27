  export interface ControlViewToggleObj {
  ViewName: string;
  TemplateId: number;
  ControlId: number;
}

export function generateMockControlViewToggleObj(): ControlViewToggleObj {
  return {
   ViewName: 'Fake View',
   TemplateId: 33,
   ControlId: 1032
  };
}
