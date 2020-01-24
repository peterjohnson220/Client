import {Router} from '@angular/router';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

import {ConnectionSummary} from '../../models';
import * as fromDataManagementMainReducer from '../../reducers';
import * as fromHrisConnectionActions from '../../actions/hris-connection.actions';
import * as fromTransferDataPageActions from '../../actions/transfer-data-page.actions';

@Component({
  selector: 'pf-hris-integration-panel',
  templateUrl: './hris-integration-panel.component.html',
  styleUrls: ['./hris-integration-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationPanelComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;

  private connectionSummary$: Observable<ConnectionSummary>;
  private subscription: Subscription;
  connectionSummary: ConnectionSummary;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary);
    this.loading$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.loadingError$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoadingError);
    this.subscription = this.connectionSummary$.pipe(skip(1)).subscribe(x => {
      this.connectionSummary = x;
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  matchesConnectionStatus(status: string) {
    if (!status) {
      return false;
    }
    return this.connectionSummary && this.connectionSummary.statuses.length &&
           this.connectionSummary.statuses.find(s => s === status);
  }

  goToDataMapping() {
    this.store.dispatch(new fromTransferDataPageActions.ProceedToMapping());
    this.router.navigate(['/transfer-data']);
  }
}
