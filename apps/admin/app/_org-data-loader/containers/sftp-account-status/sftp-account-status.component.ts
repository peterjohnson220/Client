import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-sftp-account-status',
  templateUrl: './sftp-account-status.component.html'
})
export class SftpAccountStatusComponent {
  @Input() SftpDomain: string;
  @Input() SftpPort: string;
  @Input() LoadingLoadersettings: boolean;
  @Input() CompanyAutoloaderStatus: boolean;
}
