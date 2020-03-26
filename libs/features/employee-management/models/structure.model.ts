export interface Structure {
  Name: string;
  RangeGroupId: number;
  RangeType: RangeType;
  Is: {
    GradeRange: boolean;
    JobRange: boolean;
  };
}

export enum RangeType {
  Grade = 1,
  Job = 2
}
