import { SiteAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';
import { NavigationLinkGroup } from 'libs/models/navigation';

export class PayfactorsApiModelMapper {
    static mapSiteAdminNavigationLinkResponseToNavigationLinkGroup(response: SiteAdminNavigationLinkResponse[]): NavigationLinkGroup[] {
        return response.map( ngl => {
            return {
                GroupName: ngl.NavigationLinkGroup,
                Links: ngl.Links
            };
        });
    }
}
