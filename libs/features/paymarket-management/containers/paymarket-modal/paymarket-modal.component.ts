import { Component, ViewChild, ChangeDetectionStrategy, OnDestroy, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { PayMarket, AsyncStateObj } from 'libs/models';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromPayMarketModalActions from '../../actions/paymarket-modal.actions';
import * as fromDefaultScopesActions from '../../actions/default-scopes.actions';
import * as fromExchangeScopesActions from '../../actions/exchange-scopes.actions';
import { PayMarketModalTabs } from '../../models';
import { GeneralFormComponent } from '../general-form';

@Component({
  selector: 'pf-paymarket-modal',
  templateUrl: './paymarket-modal.component.html',
  styleUrls: ['./paymarket-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayMarketModalComponent implements OnInit, OnDestroy {
  @ViewChild(GeneralFormComponent) public generalForm: GeneralFormComponent;
  @ViewChild('payMarketTabs') payMarketTabs: NgbTabset;
  @Input() companyId: number;

  modalOpen$: Observable<boolean>;
  payMarketId$: Observable<number>;
  payMarket$: Observable<AsyncStateObj<PayMarket>>;
  payMarketModalTabs = PayMarketModalTabs;
  permissions = Permissions;
  hasPeerAccess: boolean;

  modalOpenSubscription: Subscription;
  payMarketIdSubscription: Subscription;

  payMarketId: number;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private permissionService: PermissionService,
  ) {
    this.modalOpen$ = this.store.select(fromPayMarketManagementReducer.getPayMarketModalOpen);
    this.payMarketId$ = this.store.select(fromPayMarketManagementReducer.getPayMarketId);
    this.payMarket$ = this.store.select(fromPayMarketManagementReducer.getPayMarket);
  }

  ngOnInit(): void {
    this.hasPeerAccess = this.permissionService.CheckPermission(
      [Permissions.PEER], PermissionCheckEnum.Single
    );
    this.payMarketIdSubscription = this.payMarketId$.subscribe(payMarketId => {
      this.payMarketId = payMarketId;
      if (!!this.payMarketId) {
        this.store.dispatch(new fromDefaultScopesActions.LoadDefaultScopes({ payMarketId: this.payMarketId }));
        this.store.dispatch(new fromExchangeScopesActions.LoadExchangeScopeSelections({ payMarketId: this.payMarketId }));
      }
    });
    this.modalOpenSubscription = this.modalOpen$.subscribe(modalOpen => {
      if (modalOpen) {
        this.payMarketTabs.select(this.payMarketModalTabs.General);
        if (!!this.payMarketId) {
          this.store.dispatch(new fromPayMarketModalActions.LoadPayMarket({ payMarketId: this.payMarketId }));
        } else {
          this.store.dispatch(new fromPayMarketModalActions.LoadUserDefaultPayMarket());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.payMarketIdSubscription.unsubscribe();
    this.modalOpenSubscription.unsubscribe();
  }

  closeModal(): void {
    this.store.dispatch(new fromPayMarketModalActions.ClosePayMarketModal());
  }

  get submitDisabled(): boolean {
    return this.generalForm && this.generalForm.isNotValid;
  }

  savePayMarket(): void {
    const payMarketDto: PayMarket = this.generalForm.buildPayMarketDto();
    if (payMarketDto.CompanyPayMarketId) {
      this.store.dispatch(new fromPayMarketModalActions.UpdatePayMarket({PayMarketDto: payMarketDto}));
    } else {
      delete payMarketDto.CompanyPayMarketId;
      delete payMarketDto.LinkedPayMarket;
      this.store.dispatch(new fromPayMarketModalActions.AddPayMarket({PayMarketDto: payMarketDto}));
    }
  }
}
