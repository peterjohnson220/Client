import { NavigationLink } from 'libs/models/navigation/navigation-link.model';

export class SiteAdminNavigationLinkResponse {
    NavigationLinkGroup: string;
    Links: NavigationLink[];
}

export function generateMockSiteAdminNavigationLinkResponse() {
    return {
        NavigationLinkGroup: 'MockNavigationLinkGroup',
        Links: [
            {
                Name: 'I am a link',
                Url: 'https://www.payfactors.com',
                NgAppLink: false
            }
        ]
    };
}
