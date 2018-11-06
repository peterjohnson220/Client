import { Component, Input } from '@angular/core';
import { CommunityJob } from 'libs/models';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-job',
  templateUrl: './community-job.component.html',
  styleUrls: ['./community-job.component.scss']
})
export class CommunityJobComponent {
  @Input() job: CommunityJob;
  @Input() endOfList: boolean;

  get companyLogo() { return environment.companyLogoSource + this.job.CompanyLogo; }

  constructor() { }
}
