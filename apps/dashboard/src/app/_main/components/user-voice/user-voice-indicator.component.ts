import { Input, Component } from '@angular/core';
import { environment } from 'environments/environment';

import { UserContext } from 'libs/models/security/user-context.model';

@Component({
  selector: 'pf-user-voice-indicator',
  templateUrl: './user-voice-indicator.component.html',
  styleUrls: ['./user-voice-indicator.component.scss']
})
export class UserVoiceIndicatorComponent {

  userVoiceUrl = environment.userVoiceUrl;
  userVoiceForumId = environment.userVoiceForumId;

  @Input() userContext: UserContext;

  constructor() {}
}
