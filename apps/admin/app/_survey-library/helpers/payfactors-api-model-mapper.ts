import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import { CompanyBaseInformation } from 'libs/models/company';

export class PayfactorsApiModelMapper {

  static mapCompaniesResponseToCompanySelector(companies: CompanyBaseInformation[]): CompanySelectorItem[] {
    return companies.map(c => {
      return {
        CompanyId: c.CompanyId,
        CompanyName: c.Name,
        CombinedDetail: c.CombinedDetail
      };
    });
  }
}
