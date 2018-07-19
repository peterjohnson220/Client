import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';

import { Exchange, ExchangeCompany } from 'libs/models';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';

@Component({
  selector: 'pf-delete-company-modal',
  templateUrl: './delete-company-modal.component.html',
  styleUrls: ['./delete-company-modal.component.scss']
})

export class DeleteCompanyModalComponent {
    exchange$: Observable<Exchange>;
    deleteCompanyModalOpen$: Observable<boolean>;
    deletingCompany$: Observable<boolean>;

    @Input() selectedCompany: ExchangeCompany;
    @Input() exchangeId: number;

    constructor(private store: Store<fromPeerAdminReducer.State>) {
      this.exchange$ = this.store.select(fromPeerAdminReducer.getManageExchange);
      this.deleteCompanyModalOpen$ = this.store.select(fromPeerAdminReducer.getDeleteExchangeCompanyModalOpen);
      this.deletingCompany$ = this.store.select(fromPeerAdminReducer.getExchangeCompanyDeleting);
    }

    handleDeleteConfirmed() {
      this.store.dispatch(new fromExchangeCompaniesActions.DeletingExchangeCompany({
        exchangeId: this.exchangeId,
        companyId: this.selectedCompany.CompanyId
      }));
    }

    handleDeleteDenied() {
      this.store.dispatch(new fromExchangeCompaniesActions.CloseDeleteExchangeCompanyModal());
    }
}
