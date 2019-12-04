import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import * as fromFieldMappingReducer from '../../reducers';
import { EntityField } from '../../models';

@Component({
  selector: 'pf-field-mappings-card',
  templateUrl: './field-mappings-card.component.html',
  styleUrls: ['./field-mappings-card.component.scss']
})
export class FieldMappingCardComponent implements OnInit, OnDestroy {

  fieldMappingCardLoading$: Observable<boolean>;
  fieldMappingCardLoadingError$: Observable<boolean>;

  selectedEntities$: Observable<any>;
  providerFields$: Observable<EntityField>;
  payfactorFields$: Observable<EntityField>;

  providerFieldsSubscription: Subscription;
  payfactorFieldsSubscription: Subscription;
  selectedEntitiesSubscription: Subscription;

  selectedEntities: any[];
  providerFields: EntityField;
  payfactorsFields: EntityField;

  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;

  constructor(private store: Store<fromFieldMappingReducer.State>) {

    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoading);
    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoadingError);

    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getSelectedEntities);
    this.payfactorFields$ = this.store.select(fromFieldMappingReducer.getPayfactorsFields);
    this.providerFields$ = this.store.select(fromFieldMappingReducer.getProviderFields);

    this.selectedEntitiesSubscription = this.selectedEntities$
    .subscribe(v => {
      this.selectedEntities = v;
    });

    this.providerFieldsSubscription = this.providerFields$
      .subscribe(v => {
        this.providerFields = v;
      });

    this.payfactorFieldsSubscription = this.payfactorFields$
      .subscribe(v => {
        this.payfactorsFields = v;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.providerFieldsSubscription.unsubscribe();
    this.payfactorFieldsSubscription.unsubscribe();
    this.selectedEntitiesSubscription.unsubscribe();
  }
}
