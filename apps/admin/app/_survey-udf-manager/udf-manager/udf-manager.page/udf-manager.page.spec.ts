import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromUdfManagerReducer from '../reducers';

import { UdfManagerPageComponent } from './udf-manager.page';

describe('UdfManagerPageComponent', () => {
  let component: UdfManagerPageComponent;
  let fixture: ComponentFixture<UdfManagerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          surveyUdfManager: combineReducers(fromUdfManagerReducer.reducers)
        }),
      ],
      declarations: [UdfManagerPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdfManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('show one company searcher when no company is selected', () => {
    component.selectedCompany$ = of(null);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('show one company searcher when a company is selected', () => {
    component.selectedCompany$ = of({ CompanyId: 567 } as any);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('hide the udf picker when no company is selected', () => {
    component.selectedCompany$ = of(null);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('show the udf picker when a company is selected', () => {
    component.selectedCompany$ = of({ CompanyId: 567 } as any);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
