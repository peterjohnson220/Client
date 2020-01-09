import { OnInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { environment } from 'environments/environment';

import { LoaderState } from '../reducers/user-bulk-add.reducer';
import * as fromBulkAddUsersReducer from '../reducers';
import * as fromUserBulkAddActions from '../actions/user-bulk-add.action';

@Component({
  selector: 'pf-bulk-add-users',
  templateUrl: './bulk-add-users.page.html',
  styleUrls: ['./bulk-add-users.page.css']
})
export class BulkAddUsersPageComponent implements OnInit, OnDestroy {
  env = environment;
  companyId: number;
  loaderState: LoaderState;
  userWorksheet: string;
  _loaderStates: typeof LoaderState = LoaderState;
  loaderStateSubscription: Subscription;
  worksheetNamesSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private store: Store<fromBulkAddUsersReducer.State>,
              private location: Location) { }

  ngOnDestroy(): void {
    this.loaderStateSubscription.unsubscribe();
    this.worksheetNamesSubscription.unsubscribe();
  }

  ngOnInit() {
    this.companyId = parseInt(this.route.snapshot.params['companyId'], 10);
    this.loaderStateSubscription = this.store.select(fromBulkAddUsersReducer.getLoaderState).subscribe(state => this.loaderState = state);

    this.worksheetNamesSubscription = this.store.select(fromBulkAddUsersReducer.getWorksheetNames).subscribe(worksheetNames => {
        if (worksheetNames.length > 0) {
            this.userWorksheet = worksheetNames[0];
        }
    });

    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderUploadPanel());
  }

  private loadPanel (loaderState: LoaderState) {
    switch (loaderState) {
      case LoaderState.UploadPanel:
        this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderUploadPanel());
        break;
      case LoaderState.ImportValidation:
        this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderImportValidation());
        break;
      case LoaderState.ImportSummary:
        this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderImportSummary());
        break;
      case LoaderState.ImportPanel:
        this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderImportPanel());
        break;
      default:
        break;
    }
  }

  panelComplete(completePanel: LoaderState) {
    this.loadPanel(++completePanel);
  }

  panelCancel(cancelPanel: LoaderState) {
    this.reset(null);
  }

  reset(e) {
    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderUploadPanel());
  }

  next(e) {
    if (this.loaderState === LoaderState.ImportPanel) {
        this.loaderState = LoaderState.Loading;
    }
    this.loadPanel(++this.loaderState);
  }

  cancel() {
    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.location.back();
  }
}
