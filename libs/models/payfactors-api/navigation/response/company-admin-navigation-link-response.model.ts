import { NavigationLink } from 'libs/models/navigation/navigation-link.model';

export class CompanyAdminNavigationLinkResponse {
    NavigationLinkGroup: string;
    Links: NavigationLink[];
}

export function generateMockCompanyAdminNavigationLinkResponse() {
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
