import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserContext } from 'libs/models/security/index';
import { JobDescriptionManagementJobDescriptionState } from '../../../_job-description/reducers/index';
import * as fromWorkflowReducer from '../../../_job-description/reducers/index';

@Component({
  selector: 'pf-workflow-step-completion-page',
  templateUrl: './workflow-step-completion-page.component.html',
  styleUrls: ['./workflow-step-completion-page.component.scss']
})
export class WorkflowStepCompletionPageComponent implements OnInit {
  workflowCompleteMessage$: Observable<string>;
  identity$: Observable<UserContext>;
  payfactorsLogo: string;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private userContextStore: Store<fromRootState.State>,
  ) {
    this.workflowCompleteMessage$ = this.store.select(fromWorkflowReducer.getMessage);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identity$.pipe(take(1)).subscribe(i => {
      this.payfactorsLogo = i.ConfigSettings.find(cs => cs.Name === 'CloudFiles_PublicBaseUrl').Value + '/system_logos/payfactors-transparent.png';
    });
  }

}
