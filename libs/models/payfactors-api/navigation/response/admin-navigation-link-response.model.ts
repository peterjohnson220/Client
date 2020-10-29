import { NavigationLink } from 'libs/models/navigation/navigation-link.model';

export class AdminNavigationLinkResponse {
    NavigationLinkGroup: string;
    Links: NavigationLink[];
}

export function generateMockAdminNavigationLinkResponse() {
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
