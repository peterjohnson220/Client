import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { TooltipTypes } from 'libs/constants/projects/tooltip-constants';
import { ProjectListTooltipRequest } from 'libs/models/projects/tooltips/tooltip-request';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromProjectListActions from '../../actions';
import * as fromProjectListReducer from '../../reducers';

@Component({
  selector: 'pf-project-list-tooltip',
  templateUrl: './project-list-page-tooltip.component.html',
  styleUrls: ['./project-list-page-tooltip.component.scss']
})

export class ProjectListPageTooltipComponent implements OnChanges, OnInit, OnDestroy {
  @Input() columnType: TooltipTypes;
  @Input() projectId: number;

  dataTypes = TooltipTypes;
  tooltipContent$: any;
  tooltipLoading$: Observable<boolean>;
  tooltipError$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;
  avatarUrl: string;

  constructor(private store: Store<fromProjectListReducer.State>,
              private rootStore: Store<fromRootState.State>) {
    this.tooltipContent$ = this.store.pipe(select(fromProjectListReducer.getTooltipContent));
    this.tooltipLoading$ = this.store.pipe(select(fromProjectListReducer.getTooltipLoading));
    this.tooltipError$ = this.store.pipe(select(fromProjectListReducer.getTooltipError));
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
  }

  ngOnChanges(changes: SimpleChanges) {
    let dataRequest: ProjectListTooltipRequest;
    if (changes['columnType'] && changes['columnType'].currentValue !== undefined &&
      changes['projectId'] && changes['projectId'].currentValue
    ) {
      dataRequest = {
        ProjectId: changes['projectId'].currentValue,
        Option: changes['columnType'].currentValue
      };

      this.store.dispatch(new fromProjectListActions.GetTooltipContent(dataRequest));
    }
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.avatarUrl = uc.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
