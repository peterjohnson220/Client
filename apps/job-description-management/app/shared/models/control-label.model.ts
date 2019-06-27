export interface ControlLabel {
  Label: string;
  Type: string;
  TemplateId: number;
  TemplateName: string;
}

export function generateMockControlLabel(mockNumber: number = 1): ControlLabel {
  return {
      Label: `Test Label ${mockNumber}`,
      Type: `Test Type ${mockNumber}`,
      TemplateId: mockNumber,
      TemplateName: `Test Template Name ${mockNumber}`
  };
}
