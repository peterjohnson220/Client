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
  saving$: Observable<boolean>;
  savingError$: Observable<boolean>;

  // Subscriptions
  exchangeJobAssociationsSubscription: Subscription;

  // Properties
  exchangeJobAssociations: ExchangeJobAssociation[];

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  // Lifecycle
  ngOnInit(): void {
    // Register Observables
    this.exchangeJobAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations));
    this.saving$ = this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalSaving));
    this.savingError$ = this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalSavingError));

    // Register Subscriptions
    this.exchangeJobAssociationsSubscription = this.exchangeJobAssociations$
      .subscribe((exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations);
  }

  ngOnDestroy(): void {
    this.exchangeJobAssociationsSubscription.unsubscribe();
  }

  isSaveButtonEnabled(): boolean {
    if (!this.exchangeJobAssociations) {
      return false;
    }
    return this.exchangeJobAssociations.length > 0;
  }

  saveJobAssociations(): void {
    this.store.dispatch(new jobAssociationModalActions.SaveJobAssociations());
  }

  reload() {
    this.store.dispatch(new jobAssociationModalActions.ResetJobAssociationsModalState());
  }

  handleCancelClicked() {
    this.store.dispatch(new jobAssociationModalActions.CloseJobAssociationsModal());
  }
}
