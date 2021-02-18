import { RangeType } from 'libs/constants/structures/range-type';

export interface Structure {
  Name: string;
  RangeGroupId: number;
  RangeType: RangeType;
  Is: {
    GradeRange: boolean;
    JobRange: boolean;
  };
}
