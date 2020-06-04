import { ExchangeSignupCompany } from 'libs/models/payfactors-api/form';
import { CompanyBaseInformation } from 'libs/models/company';

export class PayfactorsApiModelMapper {
    static mapExchangeSignupCompanyResponseToCompanyBaseInformation(response: ExchangeSignupCompany[]): CompanyBaseInformation[] {
        return response.map(esc => {
            return {
                CompanyId: esc.Id,
                Name: esc.CompanyName
            };
        });
    }
}
