import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { ComphubBasePageDirective } from './comphub-base-page.directive';
import * as fromComphubSharedReducer from '../../../reducers';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { QuickPriceAccordionCards, ComphubPages } from '../../../data';

describe('Comphub - Shared - Comphub Base Page Directive', () => {
  let service: ComphubBasePageDirective;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
        })
      ],
      providers: [ComphubBasePageDirective, ChangeDetectorRef],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    service = TestBed.inject(ComphubBasePageDirective);
    store = TestBed.inject(Store);
  });

  it('should dispatch a NavigateToCard action, when handling a card change and the page is enabled', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Markets});

    service.enabledPages = [ComphubPages.Jobs, ComphubPages.Markets];
    service.handleCardChange(ComphubPages.Markets);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch a NavigateToCard action, when handling a card change and the page is not enabled', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Markets});

    service.enabledPages = [ComphubPages.Jobs];
    service.handleCardChange(ComphubPages.Markets);

    expect(store.dispatch).not.toHaveBeenLastCalledWith(expectedAction);
  });

  it('should track by the accordion Id', () => {
    const card = QuickPriceAccordionCards.defaultAccordionCards[0];
    expect(service.trackById(1, QuickPriceAccordionCards.defaultAccordionCards[0])).toBe(card.Id);
  });
});
