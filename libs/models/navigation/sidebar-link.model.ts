export interface SidebarLink {
  Name: string;
  DisplayName: string;
  Url: string;
  IconClass: string;
  IconClassNew: string;
  NgAppLink: boolean;
}

export function generateMockSidebarLink(): SidebarLink {
  return {
    Name: 'Sidebar link',
    DisplayName: 'Sidebar link display name',
    Url: 'https://www.payfactors.com',
    IconClass: 'fa fa-icon-class',
    IconClassNew: 'fas fa-icon-class',
    NgAppLink: false
  };
}
