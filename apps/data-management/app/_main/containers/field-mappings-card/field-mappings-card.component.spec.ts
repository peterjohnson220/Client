import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromFieldMappingReducer from '../../reducers';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import { FieldMappingCardComponent } from './field-mappings-card.component';

describe('Data Management - Main - Field Mappings Card Component', () => {
  let instance: FieldMappingCardComponent;
  let fixture: ComponentFixture<FieldMappingCardComponent>;
  let store: Store<fromFieldMappingReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          fieldMappingPage: combineReducers(fromFieldMappingReducer.reducers),
        })
      ],
      declarations: [
        FieldMappingCardComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(FieldMappingCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch an action when clicking the save button', () => {
    const expectedAction = new fromFieldMappingActions.TrySaveMapping();

    spyOn(store, 'dispatch');

    instance.saveMappings();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
