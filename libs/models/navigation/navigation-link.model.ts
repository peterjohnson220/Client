export interface NavigationLink {
  Name: string;
  Url: string;
  NgAppLink: boolean;
}

export function generateMockNavigationLink(): NavigationLink {
  return {
    Name: 'I am a link',
    Url: 'https://www.payfactors.com',
    NgAppLink: false
  };
}
