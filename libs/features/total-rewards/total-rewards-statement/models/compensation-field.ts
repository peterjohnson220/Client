import {LabelWithOverride} from './label-with-override';

export interface CompensationField {
  Id: string;
  DatabaseField: string;
  Name: LabelWithOverride;
  IsVisible: boolean;
}
