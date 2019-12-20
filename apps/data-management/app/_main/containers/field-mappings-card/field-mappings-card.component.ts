import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import * as fromFieldMappingReducer from '../../reducers';

@Component({
  selector: 'pf-field-mappings-card',
  templateUrl: './field-mappings-card.component.html',
  styleUrls: ['./field-mappings-card.component.scss']
})
export class FieldMappingCardComponent implements OnInit, OnDestroy {

  fieldMappingCardLoading$: Observable<boolean>;
  fieldMappingCardLoadingError$: Observable<boolean>;

  selectedEntities$: Observable<any>;

  selectedEntitiesSubscription: Subscription;

  selectedEntities: any[];

  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;

  constructor(private store: Store<fromFieldMappingReducer.State>) {

    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoading);
    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoadingError);

    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getSelectedEntities);

    this.selectedEntitiesSubscription = this.selectedEntities$
    .subscribe(v => {
      this.selectedEntities = v;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.selectedEntitiesSubscription.unsubscribe();
  }
}
