import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isObject } from 'lodash';
import { asapScheduler, Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { OrgDataEntityType } from 'libs/constants';

import * as fromFieldMappingActions from '../../../actions/field-mapping.actions';
import * as fromOutboundJdmActions from '../../../actions/outbound-jdm.actions';
import { ConnectionSummary } from '../../../models';
import * as fromDataManagementMainReducer from '../../../reducers';

@Component({
  selector: 'pf-outbound-field-mapping-page',
  templateUrl: './outbound-field-mapping.page.html',
  styleUrls: ['./outbound-field-mapping.page.scss']
})
export class OutboundFieldMappingPageComponent implements OnInit, OnDestroy {
  fieldMappingPageLoading$: Observable<boolean>;
  fieldMappingPageLoadingError$: Observable<boolean>;
  canSaveMappings$: Observable<boolean>;
  errorSavingMapping$: Observable<boolean>;
  savingMappings$: Observable<boolean>;

  connectionSummary$: Observable<ConnectionSummary>;

  selectedEntities: OrgDataEntityType[] = [OrgDataEntityType.JobDescriptions];
  workflowComplete: boolean;

  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj).pipe(
      map(summaryObj => summaryObj.obj),
      filter(isObject),
      takeUntil(this.unsubscribe$),
    );
    this.fieldMappingPageLoading$ = of(false);
    this.fieldMappingPageLoadingError$ = of(false);
    this.canSaveMappings$ = this.store.select(fromDataManagementMainReducer.canSaveMappings);
    this.savingMappings$ = this.store.select(fromDataManagementMainReducer.savingMappings);
    this.errorSavingMapping$ = this.store.select(fromDataManagementMainReducer.savingMappingsError);
  }

  ngOnInit() {
    asapScheduler.schedule(() => {
      this.store.dispatch(new fromOutboundJdmActions.LoadConnectionSummary());

      this.connectionSummary$.subscribe(connectionSummary => {
        this.workflowComplete = connectionSummary.hasConnection;
        if (!connectionSummary.canEditMappings && isEmpty(connectionSummary.selectedEntities)) {
          this.router.navigate(['/']);
        } else {
          this.store.dispatch(new fromOutboundJdmActions.InitFieldMappings());
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  back() {
    this.router.navigate(['/transfer-data/outbound/jdm-view-selection']);
  }

  cancel() {
    this.store.dispatch(new fromOutboundJdmActions.ResetConnectionSummary());
    this.router.navigate(['/']);
  }

  saveMappings() {
    this.store.dispatch(new fromFieldMappingActions.SaveOutboundJdmFieldMappings());
  }
}
