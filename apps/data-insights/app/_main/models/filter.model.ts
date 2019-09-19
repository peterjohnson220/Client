import { Field } from './field.model';

export interface Filter {
  Field: Field;
  Term: string;
  Options: string[];
}
