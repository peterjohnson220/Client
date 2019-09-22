import { Company } from '../../../../../libs/models/company';
import { CompanySelectorItem } from '../models';

export class PayfactorsApiModelMapper {

  static mapCompaniesResponseToCompanySelector(companies: Company[]): CompanySelectorItem[] {
    return companies.map(c => {
      return {
        CompanyId: c.CompanyId,
        CompanyName: c.CompanyName
      };
    });
  }
}
