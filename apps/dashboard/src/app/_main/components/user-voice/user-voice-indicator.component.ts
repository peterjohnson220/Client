import { Input, Component } from '@angular/core';

import { UserVoiceModel } from '../../models/user-voice.model';

@Component({
  selector: 'pf-user-voice-indicator',
  templateUrl: './user-voice-indicator.component.html',
  styleUrls: ['./user-voice-indicator.component.scss']
})
export class UserVoiceIndicatorComponent {
  @Input() model: UserVoiceModel;
  constructor() {}
}
