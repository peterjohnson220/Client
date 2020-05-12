import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
export class PayMarketModalComponent {
  @ViewChild(GeneralFormComponent, { static: false }) public generalForm: GeneralFormComponent;
  modalOpen$: Observable<boolean>;
  payMarketModalTabs = PayMarketModalTabs;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.modalOpen$ = this.store.select(fromPayMarketManagementReducer.getPayMarketModalOpen);
  }

  closeModal(): void {
    this.store.dispatch(new fromPayMarketModalActions.ClosePayMarketModal());
  }

  get submitDisabled(): boolean {
    return this.generalForm && this.generalForm.isNotValid;
  }

}
