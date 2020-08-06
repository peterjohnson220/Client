import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromPayMarketModalActions from 'libs/features/paymarket-management/actions/paymarket-modal.actions';
import * as fromPayMarketManagementReducer from 'libs/features/paymarket-management/reducers';

@Component({
  selector: 'pf-delete-paymarket-modal',
  templateUrl: './delete-paymarket-modal.component.html',
  styleUrls: ['./delete-paymarket-modal.component.scss']
})
export class DeletePaymarketModalComponent implements OnInit {
  @ViewChild('deletePayMarketModal', { static: true }) public deletePayMarketModal: any;

  @Input() payMarketName: string;
  @Input() selectedPayMarketId: number;
  @Output() resetSelectedPayMarketID = new EventEmitter();

  modalOpen$: Observable<boolean>;
  deleting$: Observable<boolean>;
  deletingError$: Observable<boolean>;

  deletePayMarketForm: FormGroup;
  checked = false;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.modalOpen$ = this.store.select(fromPayMarketManagementReducer.getDeletePayMarketModalOpen);
    this.deleting$ = this.store.pipe(select(fromPayMarketManagementReducer.getDeletingPayMarketStatus));
    this.deletingError$ = this.store.pipe(select(fromPayMarketManagementReducer.getDeletingPayMarketErrorStatus));
  }

  ngOnInit(): void {
    this.createForm();
  }

  closeModal(): void {
    this.checked = false;
    this.deletePayMarketForm.controls['ConfirmPayMarketDelete'].setValue(false);
    this.store.dispatch(new fromPayMarketModalActions.CloseDeletePayMarketModal());
    this.resetSelectedPayMarketID.emit();
  }

  deletePayMarket(): void {
    this.checked = false;
    this.store.dispatch(new fromPayMarketModalActions.DeletePayMarket(this.selectedPayMarketId));
  }

  private createForm(): void {
    this.deletePayMarketForm = this.formBuilder.group({
      ConfirmPayMarketDelete: false
    });
  }

}
