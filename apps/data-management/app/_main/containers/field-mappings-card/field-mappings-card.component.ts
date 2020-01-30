import { Component, EventEmitter, OnDestroy, ViewChild, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';


import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFieldMappingReducer from '../../reducers';
import { EntityTypeModel } from '../../models';

@Component({
  selector: 'pf-field-mappings-card',
  templateUrl: './field-mappings-card.component.html',
  styleUrls: ['./field-mappings-card.component.scss']
})
export class FieldMappingCardComponent implements OnDestroy {
  @Output() resetWorkflow = new EventEmitter();
  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;

  fieldMappingCardLoading$: Observable<boolean>;
  fieldMappingCardLoadingError$: Observable<boolean>;
  canSaveMappings$: Observable<boolean>;
  errorSavingMapping$: Observable<boolean>;
  savingMappings$: Observable<boolean>;
  selectedEntities$: Observable<EntityTypeModel[]>;

  selectedEntitiesSubscription: Subscription;

  selectedEntities: EntityTypeModel[];

  constructor(private store: Store<fromFieldMappingReducer.State>) {

    this.fieldMappingCardLoading$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoading);
    this.fieldMappingCardLoadingError$ = this.store.select(fromFieldMappingReducer.getFieldMappingCardLoadingError);
    this.canSaveMappings$ = this.store.select(fromFieldMappingReducer.canSaveMappings);
    this.selectedEntities$ = this.store.select(fromFieldMappingReducer.getSelectedEntities);
    this.savingMappings$ = this.store.select(fromFieldMappingReducer.savingMappings);
    this.errorSavingMapping$ = this.store.select(fromFieldMappingReducer.savingMappingsError);

    this.selectedEntitiesSubscription = this.selectedEntities$
    .subscribe(v => {
      this.selectedEntities = v;
    });
  }

  ngOnDestroy() {
    this.selectedEntitiesSubscription.unsubscribe();
  }

  cancelFieldMappingWorkflow() {
    this.store.dispatch(new fromFieldMappingActions.CancelMapping());
    this.resetWorkflow.emit('');
  }

  saveMappings() {
    this.store.dispatch(new fromFieldMappingActions.SaveMapping());
  }
}
