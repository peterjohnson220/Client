import { CompanySetting } from 'libs/models/company';
import { NavigationLinkGroup } from 'libs/models/navigation';
import { CompanyAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';

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

    static mapCompanySettingsToPasswordSettings(response: CompanySetting[]): CompanySetting[] {
      if (!response || !response.length) {
        return [];
      }
      return response.filter(item => item.Key.indexOf('Password') > -1);
    }
}
