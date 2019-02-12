import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { MarketsCardComponent } from './markets.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromMarketsCardActions from '../../../actions/markets-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromAddPayMarketFormActions from '../../../actions/add-paymarket-form.actions';
import { AddPayMarketFormData, generateMockAddPayMarketFormData } from '../../../models';


describe('Comphub - Main - Markets Card Component', () => {
  let instance: MarketsCardComponent;
  let fixture: ComponentFixture<MarketsCardComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ MarketsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MarketsCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch GetPaymarkets action when initialized', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsCardActions.GetPaymarkets();

    instance.ngOnInit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SetPaymarketFilter action when filter changed', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsCardActions.SetPaymarketFilter('some text');

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

    const expectedAction = new fromMarketsCardActions.SetPaymarketFilter('');

    instance.searchTerm = 'some garbage';
    instance.clearSearchValue();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SavePayMarket action when handling save pay market', () => {
    spyOn(store, 'dispatch');
    const data: AddPayMarketFormData = generateMockAddPayMarketFormData();
    const expectedAction = new fromMarketsCardActions.SavePayMarket(data);

    instance.handleSavePayMarket(data);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch NavigateToNextCard action when handling skip add pay market', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToNextCard();

    instance.handleSkipAddPayMarket();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseInfoBanner when handling dismiss info banner', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromAddPayMarketFormActions.CloseInfoBanner();

    instance.handleDismissInfoBanner();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
