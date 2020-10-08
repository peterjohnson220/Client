import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { ComphubPageComponent } from './comphub.page';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { AccordionCards, ComphubPages } from '../../../data';

describe('Comphub - Main - Comphub Page', () => {
  let instance: ComphubPageComponent;
  let fixture: ComponentFixture<ComphubPageComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ ComphubPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ComphubPageComponent);
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
    const card = AccordionCards.defaultAccordionCards[0];
    expect(instance.trackById(1, AccordionCards.defaultAccordionCards[0])).toBe(card.Id);
  });
});
