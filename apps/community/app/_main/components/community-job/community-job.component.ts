import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityJob } from 'libs/models';

import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

@Component({
  selector: 'pf-community-job',
  templateUrl: './community-job.component.html',
  styleUrls: ['./community-job.component.scss']
})
export class CommunityJobComponent {
  @Input() job: CommunityJob;
  @Input() endOfList: boolean;
  @Input() isCurrentUserJob: boolean;
  @Input() companyLogoSource: string;

  get companyLogo() { return this.companyLogoSource + this.job.CompanyLogo; }

  constructor(public store: Store<fromCommunityJobReducer.State>) { }

  delete() {
    this.store.dispatch(new fromCommunityJobActions.DeletingCommunityJob(this.job.Id));
  }

}
