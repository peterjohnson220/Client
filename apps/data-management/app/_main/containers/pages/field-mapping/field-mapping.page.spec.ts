import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

import { Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromFieldMappingActions from '../../../actions/field-mapping.actions';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import { FieldMappingPageComponent } from './field-mapping.page';

describe('Data Management - Main - Transfer Data Page', () => {
  let instance: FieldMappingPageComponent;
  let fixture: ComponentFixture<FieldMappingPageComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          fieldMappingPage: combineReducers(fromDataManagementMainReducer.reducers),
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        FieldMappingPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(FieldMappingPageComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch an action when clicking the save button', () => {
    const expectedAction = new fromFieldMappingActions.TrySaveMapping();
    spyOn(store, 'dispatch');

    instance.saveMappings();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action on init', () => {
    const expectedAction = new fromHrisConnectionActions.GetHrisConnectionSummary();
    spyOn(store, 'dispatch');

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
