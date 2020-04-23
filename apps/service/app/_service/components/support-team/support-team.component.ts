import { Component, Input } from '@angular/core';
import { SupportTeamUser } from '../../models';

@Component({
  selector: 'pf-support-team',
  templateUrl: './support-team.component.html',
  styleUrls: ['./support-team.component.scss']
})
export class SupportTeamComponent {
  @Input() user: SupportTeamUser;
  @Input() avatarUrl: string;
}
