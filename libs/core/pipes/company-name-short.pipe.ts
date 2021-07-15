import { Pipe, PipeTransform } from '@angular/core';
import { UserContext } from '../../models';

@Pipe({
  name: 'companyNameShort'
})
export class CompanyNameShortPipe implements PipeTransform {
  transform(value: string, userContext: UserContext): string {
    let companyNameDisplay = userContext.CompanyNameShort || userContext.CompanyName;
    return value.replace('Company', companyNameDisplay);
  }
}
