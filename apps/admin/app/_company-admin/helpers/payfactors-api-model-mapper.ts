import { CompanyAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';
import { NavigationLinkGroup } from 'libs/models/navigation';

export class PayfactorsApiModelMapper {
    static mapCompanyAdminNavigationLinkResponseToNavigationLinkGroup(response: CompanyAdminNavigationLinkResponse[])
        : NavigationLinkGroup[] {
        return response.map( canlr => {
            return {
                GroupName: canlr.NavigationLinkGroup,
                Links: canlr.Links
            };
        });
    }
}
