import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { UserContext } from 'libs/models/security';
import * as fromRootReducer from 'libs/state/state';

import { StandardReportDetails, EditReportFormData } from '../../../models';
import { EditReportModalComponent } from '../../../components';
import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromStandardReportsListPageActions from '../../../actions/standard-reports-list-page.actions';

@Component({
  selector: 'pf-standard-reports-list-page',
  templateUrl: './standard-reports-list.page.html',
  styleUrls: ['./standard-reports-list.page.scss']
})
export class StandardReportsListPageComponent implements OnInit, OnDestroy {
  @ViewChild(EditReportModalComponent, { static: true })
  public editReportModalComponent: EditReportModalComponent;
  standardReportDetails$: Observable<AsyncStateObj<StandardReportDetails[]>>;
  syncingStandardReports$: Observable<boolean>;
  savingReport$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  standardReportSubscription: Subscription;
  savingReportSubscription: Subscription;
  userContextSubscription: Subscription;

  allWorkbooks: StandardReportDetails[] = [];
  searchTerm: string;
  selectedReport: StandardReportDetails;
  cloudFilesPublicBaseUrl: string;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.standardReportDetails$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardReportDetailsAsync));
    this.syncingStandardReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getSyncingStandardReports));
    this.savingReport$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingReport));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromStandardReportsListPageActions.GetStandardReportDetails());
    this.standardReportSubscription = this.standardReportDetails$.subscribe(rp => this.allWorkbooks = rp.obj);
    this.savingReportSubscription = this.savingReport$.subscribe(saving => {
      if (!saving && !!this.editReportModalComponent) {
        this.editReportModalComponent.close();
      }
    });
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      if (!userContext) {
        return;
      }
      this.cloudFilesPublicBaseUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value;
    });
  }

  ngOnDestroy(): void {
    this.standardReportSubscription.unsubscribe();
    this.savingReportSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

  updateSearchTerm(value: string) {
    this.searchTerm = value;
  }

  syncStandardReports(): void {
    this.store.dispatch(new fromStandardReportsListPageActions.SyncStandardReports());
  }

  get filteredStandardReports(): StandardReportDetails[] {
    return this.searchTerm
      ? this.allWorkbooks.filter(x => (x.Name && x.Name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            || (x.DisplayName && x.DisplayName.toLowerCase().includes(this.searchTerm.toLowerCase())))
      : this.allWorkbooks;
  }

  handleEditClicked(report: StandardReportDetails) {
    if (!report) {
      return;
    }
    this.selectedReport = report;
    this.editReportModalComponent.open();
  }

  handleSaveClicked(data: EditReportFormData) {
    if (!data) {
      return;
    }
    this.store.dispatch(new fromStandardReportsListPageActions.UpdateReportDetails(data));
  }
}
