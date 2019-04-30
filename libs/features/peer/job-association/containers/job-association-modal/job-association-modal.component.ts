import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromJobAssociationReducers from '../../reducers';
import * as jobAssociationModalActions from '../../actions/job-association-modal.actions';
import { ExchangeJobAssociation } from '../../models';

@Component({
  selector: 'pf-job-association-modal',
  templateUrl: './job-association-modal.component.html',
  styleUrls: ['./job-association-modal.component.scss']
})
export class JobAssociationModalComponent implements OnInit, OnDestroy {
  // Observables
  exchangeJobAssociations$: Observable<ExchangeJobAssociation[]>;
  exchangeJobAssociationsToRemove$: Observable<number[]>;
  saving$: Observable<boolean>;
  savingError$: Observable<boolean>;
  showUnsavedChangesWarning$: Observable<boolean>;

  // Subscriptions
  exchangeJobAssociationsSubscription: Subscription;
  exchangeJobAssociationsToRemoveSubscription: Subscription;

  // Properties
  exchangeJobAssociations: ExchangeJobAssociation[];
  exchangeJobAssociationsToRemove: number[];

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  // Lifecycle
  ngOnInit(): void {
    // Register Observables
    this.exchangeJobAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations));
    this.exchangeJobAssociationsToRemove$ = this.store.pipe(select(fromJobAssociationReducers.getPreviousAssociationsToDelete));
    this.saving$ = this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalSaving));
    this.savingError$ = this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalSavingError));
    this.showUnsavedChangesWarning$ = this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalShowUnsavedChangesWarning));

    // Register Subscriptions
    this.exchangeJobAssociationsSubscription = this.exchangeJobAssociations$.subscribe(
      (exchangeJobAssociations) => {
        this.exchangeJobAssociations = exchangeJobAssociations;
        this.store.dispatch(new jobAssociationModalActions.ChangeSaveableEntities(this.isSaveButtonEnabled()));
      });

    this.exchangeJobAssociationsToRemoveSubscription = this.exchangeJobAssociationsToRemove$.subscribe(
      (exchangeJobToCompanyJobIds) => {
        this.exchangeJobAssociationsToRemove = exchangeJobToCompanyJobIds;
        this.store.dispatch(new jobAssociationModalActions.ChangeSaveableEntities(this.isSaveButtonEnabled()));
      });

    this.store.dispatch(new jobAssociationModalActions.Initialize());
  }

  ngOnDestroy(): void {
    this.exchangeJobAssociationsSubscription.unsubscribe();
    this.exchangeJobAssociationsToRemoveSubscription.unsubscribe();
  }

  isSaveButtonEnabled(): boolean {
    if (!this.exchangeJobAssociations || !this.exchangeJobAssociationsToRemove) {
      return false;
    }
    return this.exchangeJobAssociations.length > 0 || this.exchangeJobAssociationsToRemove.length > 0;
  }

  saveJobAssociations(): void {
    this.store.dispatch(new jobAssociationModalActions.SaveJobAssociations());
  }

  reload() {
    this.store.dispatch(new jobAssociationModalActions.ReloadJobAssociationsModal());
  }

  handleCancelClicked() {
    if (this.isSaveButtonEnabled()) {
      this.store.dispatch(new jobAssociationModalActions.CloseModalWithSaveableChanges());
    } else {
      this.store.dispatch(new jobAssociationModalActions.CloseJobAssociationsModal());
    }
  }

  handleLeaveModalConfirmed() {
    this.store.dispatch(new jobAssociationModalActions.CloseJobAssociationsModal());
  }

  handleLeaveModalCancelled() {
    this.store.dispatch(new jobAssociationModalActions.CancelUnsavedChangesWarning());
  }
}
