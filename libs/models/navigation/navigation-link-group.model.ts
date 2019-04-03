import { NavigationLink } from './navigation-link.model';

export class NavigationLinkGroup {
    GroupName: string;
    Links: NavigationLink[];
}

export function generateNavigationLinkGroup(): NavigationLinkGroup {
    return {
        GroupName: 'MockGroupName',
        Links: [
            {
                Name: 'MockLinkName1',
                Url: 'http://mock-url-1.url',
                NgAppLink: false
            },
            {
                Name: 'MockLinkName2',
                Url: 'http://mock-url-2.url',
                NgAppLink: false
            }
        ]
    };
}

export function generateNavigationLinkGroupLinks(): NavigationLinkGroup[] {
    return [{
        GroupName: 'MockGroupNameA',
        Links: [
            {
                Name: 'MockLinkNameA1',
                Url: 'http://mock-url-1.url',
                NgAppLink: false
            },
            {
                Name: 'MockLinkNameA2',
                Url: 'http://mock-url-a-2.url',
                NgAppLink: false
            }
        ]
    },
    {
        GroupName: 'MockGroupNameB',
        Links: [
            {
                Name: 'MockLinkNameB1',
                Url: 'http://mock-url-b-1.url',
                NgAppLink: false
            },
            {
                Name: 'MockLinkNameB2',
                Url: 'http://mock-url-b-2.url',
                NgAppLink: false
            }
        ]
    }];
}
