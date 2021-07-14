import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { QuickPriceType } from 'libs/constants';
import { generateMockPricingPaymarket } from 'libs/models/comphub';

import { MarketsCardComponent } from './markets.card.component';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromMarketsCardActions from '../../../../_shared/actions/markets-card.actions';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromAddPayMarketFormActions from '../../../../_shared/actions/add-paymarket-form.actions';
import { AddPayMarketFormData, generateMockAddPayMarketFormData, generateMockWorkflowContext } from '../../../../_shared/models';
import { ComphubPages } from '../../../../_shared/data';

describe('Comphub - Main - Markets Card Component', () => {
  let instance: MarketsCardComponent;
  let fixture: ComponentFixture<MarketsCardComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
        })
      ],
      declarations: [ MarketsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MarketsCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);

    instance.workflowContext = {
      ...generateMockWorkflowContext(),
      selectedPageId: ComphubPages.Markets
    };
    fixture.detectChanges();
  });

  it('should dispatch SetPaymarketFilter action when filter changed', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromMarketsCardActions.SetPaymarketFilter('some text');

    instance.handleSearchChanged('some text');

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

  it('should dispatch OpenForm from AddPayMarketForm actions when add new market clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromAddPayMarketFormActions.OpenForm();

    instance.handleAddNewMarketClicked();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch filter locations action when location filter changed', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromMarketsCardActions.GetMarketDataLocations('test');

    instance.handleLocationFilterChanged('test');

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseForm from AddPayMarketForm actions when cancel button clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromAddPayMarketFormActions.CloseForm();

    instance.handleCancelAddPayMarket();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch a SetSelectedPayMarket action, when handling a paymarket being checked', () => {
    spyOn(store, 'dispatch');
    const selectedPayMarket = generateMockPricingPaymarket();
    const expectedAction = new fromMarketsCardActions.SetSelectedPaymarket(
      {paymarket: selectedPayMarket, initialLoad: false, quickPriceType: QuickPriceType.ENTERPRISE});

    instance.handlePaymarketChecked(selectedPayMarket);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should call handleSearchBoxValueChanged with an empty string, when clearing the search value', () => {
    spyOn(instance, 'handleSearchChanged');

    instance.clearSearchValue();

    expect(instance.handleSearchChanged).toBeCalledWith('');
  });

  it('should hide the add paymarkets button when restrictions exist', () => {

    instance.hideNewPaymarketButton$ = of(true);
    instance.paymarkets$ = of([generateMockPricingPaymarket()]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should NOT hide the add paymarkets button when no restrictions exist', () => {

    instance.hideNewPaymarketButton$ = of(false);
    instance.paymarkets$ = of([generateMockPricingPaymarket()]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
