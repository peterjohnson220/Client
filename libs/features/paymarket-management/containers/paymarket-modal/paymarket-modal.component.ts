import { Component, ViewChild, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromPayMarketModalActions from '../../actions/paymarket-modal.actions';
import { PayMarketModalTabs } from '../../models';
import { GeneralFormComponent } from '../general-form';

@Component({
  selector: 'pf-paymarket-modal',
  templateUrl: './paymarket-modal.component.html',
  styleUrls: ['./paymarket-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayMarketModalComponent implements OnInit, OnDestroy {
  @ViewChild(GeneralFormComponent, { static: false }) public generalForm: GeneralFormComponent;
  @ViewChild('payMarketTabs', { static: false }) payMarketTabs: NgbTabset;
  modalOpen$: Observable<boolean>;
  payMarketModalTabs = PayMarketModalTabs;

  modalOpenSubscription: Subscription;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.modalOpen$ = this.store.select(fromPayMarketManagementReducer.getPayMarketModalOpen);
  }

  ngOnInit(): void {
    this.modalOpenSubscription = this.modalOpen$.subscribe(modalOpen => {
      if (modalOpen) {
        this.payMarketTabs.select(this.payMarketModalTabs.General);
      }
      if (modalOpen && this.generalForm) {
        this.generalForm.refresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.modalOpenSubscription.unsubscribe();
  }

  closeModal(): void {
    this.store.dispatch(new fromPayMarketModalActions.ClosePayMarketModal());
  }

  get submitDisabled(): boolean {
    return this.generalForm && this.generalForm.isNotValid;
  }

}
