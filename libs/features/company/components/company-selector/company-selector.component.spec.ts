import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { CompanySelectorComponent } from './company-selector.component';
import * as fromCompanySelectorReducer from '../../reducers';
import * as fromCompanySelectorActions from '../../actions';

describe('CompanySelectorComponent', () => {
  let instance: CompanySelectorComponent;
  let fixture: ComponentFixture<CompanySelectorComponent>;
  let store: Store<fromRootState.State>;
  const companies = [{ CompanyId: 1, CompanyName: 'Test1' }, { CompanyId: 2, CompanyName: 'abc2' }];


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({
        ...fromRootState.reducers,
        companySelector: combineReducers(fromCompanySelectorReducer.reducers),
      })],
      declarations: [CompanySelectorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(CompanySelectorComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch a GetCompanies on onInit', () => {
    instance.ngOnInit();
    const action = new fromCompanySelectorActions.GetCompanies();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should filter companies for drop down', () => {
    instance.companies = companies;
    instance.filterData('ab');
    expect(instance.filteredData).toEqual([companies[1]]);

  });
});
