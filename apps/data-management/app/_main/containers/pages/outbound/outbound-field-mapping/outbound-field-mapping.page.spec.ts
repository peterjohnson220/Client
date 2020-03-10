import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

import { Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../../../reducers';
import * as fromFieldMappingActions from '../../../../actions/field-mapping.actions';
import * as fromOutboundJdmActions from '../../../../actions/outbound-jdm.actions';

import { OutboundFieldMappingPageComponent } from './outbound-field-mapping.page';

describe('Data Management - Main - Transfer Data - Outbound Field Mapping Page', () => {
  let instance: OutboundFieldMappingPageComponent;
  let fixture: ComponentFixture<OutboundFieldMappingPageComponent>;
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
        OutboundFieldMappingPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(OutboundFieldMappingPageComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch an action when clicking the save button', () => {
    // arrange
    const expectedAction = new fromFieldMappingActions.SaveOutboundJdmFieldMappings();
    const spy = jest.spyOn(store, 'dispatch');

    // act
    instance.saveMappings();

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
