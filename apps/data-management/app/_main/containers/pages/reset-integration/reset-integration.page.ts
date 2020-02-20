import {Router} from '@angular/router';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

import {CredentialsPackage} from 'libs/models/hris-api/connection/request';

import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import * as fromDataManagementMainReducer from '../../../reducers';

@Component({
  selector: 'pf-reset-integration',
  templateUrl: './reset-integration.page.html',
  styleUrls: ['./reset-integration.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetIntegrationPageComponent implements OnInit, OnDestroy {
  activeConnection$: Observable<CredentialsPackage>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  saving$: Observable<boolean>;
  savingError$: Observable<boolean>;
  deleteCompleted$: Observable<boolean>;
  loadingErrorSubscription: Subscription;
  deleteCompletedSubscription: Subscription;

  constructor(private store: Store<fromDataManagementMainReducer.State>,
              private router: Router) {
    this.activeConnection$ = this.store.select(fromDataManagementMainReducer.getHrisActiveConnection);
    this.loading$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.loadingError$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoadingError);
    this.saving$ = this.store.select(fromDataManagementMainReducer.getHrisActiveConnectionSaving);
    this.savingError$ = this.store.select(fromDataManagementMainReducer.getHrisActiveConnectionSavingError);
    this.deleteCompleted$ = this.store.select(fromDataManagementMainReducer.getHrisActiveConnectionDeleteCompleted);
    this.deleteCompletedSubscription = this.deleteCompleted$.subscribe(c => {
      if (c === true) {
        this.goHome();
      }
    });
    this.loadingErrorSubscription = this.loadingError$.pipe(skip(1)).subscribe(c => {
      if (c === true) {
        this.goHome();
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromHrisConnectionActions.GetCurrentHrisConnection());
  }

  ngOnDestroy() {
    this.deleteCompletedSubscription.unsubscribe();
    this.loadingErrorSubscription.unsubscribe();
  }

  doReset() {
    this.store.dispatch(new fromHrisConnectionActions.DeleteHRISConnection());
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
