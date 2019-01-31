import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { MarketsPageComponent } from './markets.page.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromMarketsPageActions from '../../../actions/markets-page.actions';
import { AddPayMarketFormData, generateMockAddPayMarketFormData } from '../../../models';


describe('Comphub - Main - Markets Page Component', () => {
  let instance: MarketsPageComponent;
  let fixture: ComponentFixture<MarketsPageComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ MarketsPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MarketsPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch GetPaymarkets action when initialized', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsPageActions.GetPaymarkets();

    instance.ngOnInit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SetPaymarketFilter action when filter changed', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsPageActions.SetPaymarketFilter('some text');

    instance.handleSearchChanged('some text');

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should clear the search term when clear called', () => {
    spyOn(store, 'dispatch');

    instance.searchTerm = 'blah';

    instance.clearSearchValue();

    expect(instance.searchTerm).toBeFalsy();
  });

  it('should clear the paymarket filter when search value cleared', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsPageActions.SetPaymarketFilter('');

    instance.searchTerm = 'some garbage';
    instance.clearSearchValue();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SavePayMarket action when handling save pay market', () => {
    spyOn(store, 'dispatch');
    const data: AddPayMarketFormData = generateMockAddPayMarketFormData();
    const expectedAction = new fromMarketsPageActions.SavePayMarket(data);

    instance.handleSavePayMarket(data);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SkipPayMarket action when handling skip pay market', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromMarketsPageActions.SkipPayMarket();

    instance.handleSkipPayMarket();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
