export interface UserVoiceLink {
  Name: string;
  Url: string;
  NgAppLink: boolean;
}

export function generateMockUserVoiceLink(): UserVoiceLink {
  return {
    Name: 'Sidebar link',
    Url: 'https://www.payfactors.com',
    NgAppLink: false
  };
}
