import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-authentication-status',
  templateUrl: './authentication-status.component.html',
  styleUrls: ['./authentication-status.component.scss']
})
export class AuthenticationStatusComponent {

  @Input() hasConnection: boolean;
  @Input() authenticationStatuses: string[];

  constructor() {

  }

  matchesAuthenticationStatus(status: string) {
    if (!status) {
      return false;
    }
    return this.authenticationStatuses && this.authenticationStatuses.length &&
           this.authenticationStatuses.find(s => s === status);
  }
}
