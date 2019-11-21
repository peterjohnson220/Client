export interface JobInfoViewField {
  Id: number;
  Name: string;
  Checked: boolean;
  Locked: boolean;
}

export function generateMockJobInfoViewField(): JobInfoViewField {
  return {
    Id: 999,
    Name: 'Job Info Field',
    Checked: false,
    Locked: false
  };
}
