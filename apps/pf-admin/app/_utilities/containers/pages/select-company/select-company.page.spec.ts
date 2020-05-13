import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromSelectCompanyActions from '../../../actions/select-company.actions';
import { generateMockDataListItem } from '../../../models';
import * as fromUtilitiesReducer from '../../../reducers';
import { SelectCompanyPageComponent } from './select-company.page';

describe('Pf-Admin - Utilities - Select Company Page', () => {
  let instance: SelectCompanyPageComponent;
  let fixture: ComponentFixture<SelectCompanyPageComponent>;
  let store: Store<fromUtilitiesReducer.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          utilities: combineReducers(fromUtilitiesReducer.reducers),
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [ SelectCompanyPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SelectCompanyPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('Should dispatch a LoadCompaniesListIfEmpty action upon Init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSelectCompanyActions.LoadCompaniesListIfEmpty();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a SetCompanyFilter action with a value, when handling the filter changed', () => {
    spyOn(store, 'dispatch');
    const filter = 'blahblah';
    const expectedAction = new fromSelectCompanyActions.SetCompanyFilter(filter);

    instance.handleFilterChanged(filter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should navigate to the default scopes page for the data list item id, when handling a company click', () => {
    spyOn(router, 'navigate');
    const dataListItem = generateMockDataListItem();

    instance.handleCompanyClicked(dataListItem);

    expect(router.navigate).toHaveBeenCalledWith(['/utilities/yoy-default-scopes', dataListItem.Id]);
  });
});
