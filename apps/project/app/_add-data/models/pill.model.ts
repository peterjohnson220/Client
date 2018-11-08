export interface PillGroup {
  GroupName: string;
  FilterId: string;
  PreviewString: string;
  Locked: boolean;
  Pills: Pill[];
}

export interface Pill {
  FilterId: string;
  ValueName: string;
  Value: any;
}

export function generateMockPillGroup(): PillGroup {
  return {
    GroupName: 'Job Family',
    FilterId: 'job_family',
    PreviewString: 'Engineering',
    Locked: false,
    Pills: [generateMockPill()]
  };
}

export function generateMockPill(): Pill {
  return {
    FilterId: 'job_family',
    ValueName: 'Engineering',
    Value: 'Engineering'
  };
}
