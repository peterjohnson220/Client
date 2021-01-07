import { RangeType } from 'libs/models/common';

export interface Structure {
  Name: string;
  RangeGroupId: number;
  RangeType: RangeType;
  Is: {
    GradeRange: boolean;
    JobRange: boolean;
  };
}
