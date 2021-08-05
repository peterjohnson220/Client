import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import { QuickPriceLandingPageComponent } from './quick-price-landing.page';
import { QuickPriceAccordionCards, ComphubPages } from '../../../../_shared/data';

describe('Quick Price - Main - Quick Price Page', () => {
  let instance: QuickPriceLandingPageComponent;
  let fixture: ComponentFixture<QuickPriceLandingPageComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
        })
      ],
      declarations: [ QuickPriceLandingPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(QuickPriceLandingPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should dispatch a NavigateToCard action, when handling a card change and the page is enabled', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Markets});

    instance.enabledPages = [ComphubPages.Jobs, ComphubPages.Markets];
    instance.handleCardChange(ComphubPages.Markets);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch a NavigateToCard action, when handling a card change and the page is not enabled', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Markets});

    instance.enabledPages = [ComphubPages.Jobs];
    instance.handleCardChange(ComphubPages.Markets);

    expect(store.dispatch).not.toHaveBeenLastCalledWith(expectedAction);
  });

  it('should track by the accordion Id', () => {
    const card = QuickPriceAccordionCards.defaultAccordionCards[0];
    expect(instance.trackById(1, QuickPriceAccordionCards.defaultAccordionCards[0])).toBe(card.Id);
  });
});
