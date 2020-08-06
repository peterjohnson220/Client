import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CompanySettingsEnum, NavigationLink, UserContext } from 'libs/models';
import * as fromLayoutReducer from 'libs/ui/layout-wrapper/reducers';
import { SettingsService } from 'libs/state/app-context/services';

import { JobDescriptionManagementJobDescriptionState } from '../../../_job-description/reducers/index';
import * as fromWorkflowReducer from '../../../_job-description/reducers/index';

@Component({
  selector: 'pf-workflow-step-completion-page',
  templateUrl: './workflow-step-completion-page.component.html',
  styleUrls: ['./workflow-step-completion-page.component.scss']
})
export class WorkflowStepCompletionPageComponent implements OnInit {
  headerDropdownNavigationLinks$: Observable<NavigationLink[]>;
  identity$: Observable<UserContext>;
  requireSSOLogin$: Observable<boolean>;
  workflowCompleteMessage$: Observable<string>;

  navigationLinks: NavigationLink[];
  payfactorsLogo: string;
  requireSSOLogin: boolean;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private userContextStore: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>,
    private settingsService: SettingsService
  ) {
    this.workflowCompleteMessage$ = this.store.select(fromWorkflowReducer.getMessage);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.headerDropdownNavigationLinks$ = this.layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
    this.requireSSOLogin$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.JDMExternalWorkflowsRequireSSOLogin);
  }

  ngOnInit() {
    this.headerDropdownNavigationLinks$.pipe(take(1)).subscribe((res) => {
      this.navigationLinks = res;
    });

    this.identity$.pipe(take(1)).subscribe(i => {
      this.payfactorsLogo = i.ConfigSettings.find(cs => cs.Name === 'CloudFiles_PublicBaseUrl').Value + '/system_logos/payfactors-transparent.png';
    });

    this.requireSSOLogin$.pipe(take(1)).subscribe((res) => {
      this.requireSSOLogin = res;
    });
  }

}
