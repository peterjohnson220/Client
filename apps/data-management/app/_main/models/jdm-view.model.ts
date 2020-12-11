export interface JdmView {
  DisplayText: string;
  Id: number;
  isChecked: boolean;
  isEnabled: boolean;
}

export function generateMockJdmView(name: string, id: number): JdmView {
  return {
    DisplayText: name,
    Id: id,
    isChecked: false,
    isEnabled: true,
  };
}

export function generateMockJdmViewList(): JdmView[] {
  return [
    generateMockJdmView('Workday export view', 1),
    generateMockJdmView('Europe', 2),
    generateMockJdmView('Retail', 3),
    generateMockJdmView('Talent Acquistion', 4),
    generateMockJdmView('HR view', 5),
  ];
}
