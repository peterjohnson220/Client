import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeCompany } from 'libs/models';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';

import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';

@Component({
  selector: 'pf-exchange-companies',
  templateUrl: './exchange-companies.component.html',
  styleUrls: ['./exchange-companies.component.scss']
})
export class ExchangeCompaniesComponent implements OnInit {
  exchangeCompaniesLoading$: Observable<boolean>;
  exchangeCompaniesLoadingError$: Observable<boolean>;
  exchangeCompanies$: Observable<ExchangeCompany[]>;
  view$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private gridHelperService: GridHelperService,
  ) {
    this.exchangeCompaniesLoading$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesLoading);
    this.exchangeCompaniesLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesLoadingError);
    this.exchangeCompanies$ = this.store.select(fromPeerAdminReducer.getExchangeCompanies);
    this.view$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesGrid);
    this.gridState$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesGridState);

    this.exchangeId = this.route.snapshot.params.id;
  }

  // Events
  handleExchangeCompaniesGridReload() {
    this.store.dispatch(new fromExchangeCompaniesActions.LoadingExchangeCompanies(this.exchangeId));
  }

  handlePageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeCompanies, event));
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
  }

  handleSortChange(sort: SortDescriptor[]) {
    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.ExchangeCompanies, sort));
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
  }

  // Lifecycle
  ngOnInit() {
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
  }
}
