import { Pipe, PipeTransform } from '@angular/core';

import { OrgDataEntityType, getOrgDataEntityTypeDisplayName } from 'libs/constants';


@Pipe({
  name: 'orgDataEntityTypeToDisplayName'
})
export class OrgDataEntityTypeToDisplayName implements PipeTransform {
  transform = (value: OrgDataEntityType) => getOrgDataEntityTypeDisplayName(value);
}
