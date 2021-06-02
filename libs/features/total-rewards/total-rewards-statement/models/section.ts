import { Column } from './column';

export interface Section {
  Columns: Column[];
  ContainsRepeatableHeaderContent?: boolean;
}
