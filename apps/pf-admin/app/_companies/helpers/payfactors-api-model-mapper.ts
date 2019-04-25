import { CompanyListResponseModel } from 'libs/models/payfactors-api/company';
import { CompanyGridItem } from '../models';

export class PayfactorsApiModelMapper {
    static mapCompanyListResponseToCompanyGridItem(response: CompanyListResponseModel[]): CompanyGridItem[] {
        return response.map( clrm => clrm);
    }
}
