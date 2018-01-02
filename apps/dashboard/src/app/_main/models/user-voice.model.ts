export interface UserVoiceModel {
  userId: number;
  userVoiceUrl: string;
  userVoiceForumId: number;
}

export function generateMockUserVoiceModel(): UserVoiceModel {
  return {
    userId: 1,
    userVoiceUrl: 'http://payfactors.uservoice.com/forums/',
    userVoiceForumId: 268517
  };
}
