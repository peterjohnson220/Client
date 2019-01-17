import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { ComphubPageComponent } from './comphub.page';
import * as fromComphubMainReducer from '../../reducers';
import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import { ComphubPages } from '../../data';

describe('Comphub - Comphub Main Page', () => {
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

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch AccordionCardChange action when next page is selected', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromComphubPageActions.AccordionCardChange({ cardId: ComphubPages.Markets});

    instance.handleCardChange(ComphubPages.Markets);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
