import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';

import { ExchangeListItem } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeListActions from '../../actions/exchange-list.actions';

@Component({
  selector: 'pf-delete-exchange-modal',
  templateUrl: './delete-exchange-modal.component.html',
  styleUrls: ['./delete-exchange-modal.component.scss']
})

export class DeleteExchangeModalComponent {
  deleteExchangeModalOpen$: Observable<boolean>;
  deletingExchange$: Observable<boolean>;

  @Input() selectedExchange: ExchangeListItem;

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.deleteExchangeModalOpen$ = this.store.select(fromPeerAdminReducer.getExchangeListDeleteExchangeModalOpen);
    this.deletingExchange$ = this.store.select(fromPeerAdminReducer.getExchangeListDeleting);
  }

  handleDeleteConfirmed() {
    this.store.dispatch(new fromExchangeListActions.DeleteExchange(this.selectedExchange.ExchangeId));
  }

  handleDeleteDenied() {
    this.store.dispatch(new fromExchangeListActions.CloseDeleteExchangeModal());
  }
}
