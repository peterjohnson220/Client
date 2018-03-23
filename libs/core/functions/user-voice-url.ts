import { environment } from 'environments/environment';

export function userVoiceUrl(parentLink: string, userId: number): string {
  return parentLink + '?userId=' + userId + '&url=' + environment.userVoiceUrl + environment.userVoiceForumId;
}
