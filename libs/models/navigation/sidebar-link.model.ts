export interface SidebarLink {
  Name: string;
  Url: string;
  IconClass: string;
  NgAppLink: boolean;
}

export function generateMockSidebarLink(): SidebarLink {
  return {
    Name: 'Sidebar link',
    Url: 'https://www.payfactors.com',
    IconClass: 'fa fa-icon-class',
    NgAppLink: false
  };
}
