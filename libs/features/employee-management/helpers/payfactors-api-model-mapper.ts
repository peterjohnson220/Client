import { orderBy } from 'lodash';

import { KendoTypedDropDownItem } from 'libs/models/kendo';

import { CompanyEmployee, CompanyJob } from 'libs/models/company';
import { EntityKeyFieldsResponse } from 'libs/models/payfactors-api/validation';

import { EmployeeValidation, Job, Structure, RangeType } from '../models';
import { EmployeeModalStructuresResponse } from 'libs/models/payfactors-api';

export class PayfactorsApiModelMapper {

  static mapToDropdownList(response: any, valueField: string, nameField: string): KendoTypedDropDownItem[] {
    return this.mapItemsToDropdownList(response, valueField, (item => {
      return item[nameField];
    }));
  }

  static mapItemsToDropdownList(response: any, valueField: string, nameMappingFunction: (item: any) => string): KendoTypedDropDownItem[] {
    if (response && response.length) {
      const dropListItems = response.map(item => {
        return {
          Name: nameMappingFunction(item),
          Value: item[valueField] || null
        };
      });
      return orderBy(dropListItems, ['Name'], 'asc');
    }
    return [];
  }

  static mapEmployeeModalStructuresReponsesToStructures(response: EmployeeModalStructuresResponse[]): Structure[] {
    if (response && response.length) {
      const structures: Structure[] = response.map(item => {
        return {
          Name: item.StructureName,
          RangeGroupId: item.CompanyStructuresRangeGroupId,
          RangeType: item.TypeId,
          Is: {
            GradeRange: item.TypeId === RangeType.Grade,
            JobRange: item.TypeId === RangeType.Job
          }
        };
      });
      return orderBy(structures, ['Name'], 'asc');
    }
    return [];
  }

  static mapEntityKeyFieldsResponseToEmployeeValidation(response: EntityKeyFieldsResponse, employee: CompanyEmployee): EmployeeValidation {
    const message: string = response.IsValid
      ? ''
      : 'The highlighted fields must be unique';
    const keys = response.EntityKeyFields.length
      ? response.EntityKeyFields.map(f => f.KeyField)
      : ['EmployeeId'];
    return {
      IsValid: response.IsValid,
      FieldKeys: keys,
      Employee: employee,
      Message: message
    };
  }

  static mapCompanyJobsToJobs(response: CompanyJob[]): Job[] {
    if (response && response.length) {
      const jobs = response.map(job => {
        return {
          CompanyJobId: job.CompanyJobId,
          JobCode: job.JobCode,
          JobTitle: job.JobTitle,
          DisplayName: `${job.JobCode} - ${job.JobTitle}`
        };
      });
      return orderBy(jobs, ['DisplayName'], 'asc');
    }
    return [];
  }
}
