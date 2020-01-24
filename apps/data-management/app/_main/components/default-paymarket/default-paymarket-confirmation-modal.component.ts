import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFieldMappingReducer from '../../reducers';

@Component({
  selector: 'pf-default-paymarket-confirmation-modal',
  templateUrl: './default-paymarket-confirmation-modal.component.html',
  styleUrls: ['./default-paymarket-confirmation-modal.component.scss']
})
export class DefaultPaymarketConfirmationModalComponent implements OnInit {
  defaultPaymarket$: Observable<string>;
  modalOpen$: Observable<boolean>;

  constructor(private store: Store<fromFieldMappingReducer.State>) {
    this.defaultPaymarket$ = this.store.select(fromFieldMappingReducer.getDefaultPaymarket);
    this.modalOpen$ = this.store.select(fromFieldMappingReducer.getDefaultPaymarketModalOpen);
  }

  ngOnInit() {
    this.store.dispatch(new fromFieldMappingActions.LoadDefaultPaymarket());
  }

  handleDismissDefaultPaymarketsModal(saveDefaultPaymarket: boolean) {
    this.store.dispatch(new fromFieldMappingActions.DismissDefaultPaymarketModal({
      saveDefaultPaymarket,
    }));
  }

}
