import { Component, Input } from '@angular/core';
import { SupportTeamUser } from '../../models';

@Component({
  selector: 'pf-service-dashboard',
  templateUrl: './service-dashboard.component.html',
  styleUrls: ['./service-dashboard.component.scss']
})
export class ServiceDashboardComponent {
  @Input() supportTeam: SupportTeamUser[];
  @Input() avatarUrl: string;
  staticSupportTeams = [
    {
      TeamName: 'Peer Team',
      TeamEmail: 'peer.services@payfactors.com'
    },
    {
      TeamName: 'Compensation Team',
      TeamEmail: 'peer.services@payfactors.com'
    }
  ];
}
