import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { AsyncStateObj, PayMarketAssociationsSummary } from 'libs/models';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromPayMarketAssociationActions from '../../actions/paymarket-association.actions';
import { PayMarketAssociationType } from '../../models';

@Component({
  selector: 'pf-paymarket-associations',
  templateUrl: './paymarket-associations.component.html',
  styleUrls: ['./paymarket-associations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymarketAssociationsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() companyPaymarketId: number;

  payMarketAssociationsSummary$: Observable<AsyncStateObj<PayMarketAssociationsSummary>>;
  associationsSubscription: Subscription;

  @ViewChild('accordion') accordion: NgbAccordion;
  anyAssociations: boolean;
  payMarketAssociationsSummary: PayMarketAssociationsSummary;
  associationType = PayMarketAssociationType;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.payMarketAssociationsSummary$ = this.store.select(fromPayMarketManagementReducer.getPayMarketAssociationsSummary);
  }

  ngOnInit(): void {
    this.associationsSubscription = this.payMarketAssociationsSummary$.subscribe(as => {
      if (!!as && !!as.obj) {
        this.anyAssociations = !!as.obj.LinkedPaymarketName || as.obj.EmployeeCount > 0 || as.obj.PricingProjectsCount > 0
          || as.obj.StructuresCount > 0 || as.obj.PublishedPricingsCount > 0;
        this.payMarketAssociationsSummary = as.obj;
      }
    });
  }

  ngOnDestroy(): void {
    this.associationsSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.companyPaymarketId?.currentValue) {
      if (this.companyPaymarketId) {
        this.store.dispatch(new fromPayMarketAssociationActions.LoadPaymarketAssociationsSummary(this.companyPaymarketId));
        this.collapseAllPanels();
      }
    }
  }

  togglePanel(panelId: string): void {
    this.accordion.toggle(panelId);
  }

  collapseAllPanels(): void {
    if (this.accordion) {
      this.accordion.collapseAll();
    }
  }
}
