import { EmployeeModalSectionEnum } from './employee-modal-section.enum';

export interface EmployeeModalSectionModel {
  sectionEnum: EmployeeModalSectionEnum;
  fieldNames: string[];
  employeeValidationFields: string[];
}
