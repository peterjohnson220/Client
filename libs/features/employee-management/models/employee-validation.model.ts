import { CompanyEmployee } from 'libs/models';

export interface EmployeeValidation {
  IsValid: boolean;
  FieldKeys: string[];
  Employee: CompanyEmployee;
  Message: string;
}
