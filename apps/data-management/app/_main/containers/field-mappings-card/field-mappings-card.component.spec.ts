import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { FieldMappingCardComponent } from './field-mappings-card.component';
import * as fromFieldMappingReducer from '../../reducers';

describe('Data Management - Main - Field Mappings Card Component', () => {
  let instance: FieldMappingCardComponent;
  let fixture: ComponentFixture<FieldMappingCardComponent>;

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

    fixture = TestBed.createComponent(FieldMappingCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
