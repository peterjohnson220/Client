export interface Tab {
  Title: string;
  Path: string;
  IsVisible: boolean;
}

export enum TabName {
  MyProfile = 'My Profile',
  DashboardPreferences = 'Dashboard Preferences'
}
