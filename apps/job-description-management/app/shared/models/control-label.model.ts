export interface ControlLabel {
  Label: string;
  Type: string;
  TemplateId: number;
  TemplateName: string;
}

export function generateMockControlLabel(): ControlLabel {
  return {
      Label: 'Test Label',
      Type: 'Test Type',
      TemplateId: 1,
      TemplateName: 'Test Template Name'
  };
}
