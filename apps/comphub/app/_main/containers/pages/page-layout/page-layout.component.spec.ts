import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { PageLayoutComponent } from './page-layout.component';

describe('Comphub - Main - Page Layout', () => {
  let instance: PageLayoutComponent;
  let fixture: ComponentFixture<PageLayoutComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ PageLayoutComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PageLayoutComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch a NavigateToNextCard action, when handling the next button click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToNextCard();

    instance.handleNextButtonClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a NavigateToPreviousCard action, when handling the back button click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.NavigateToPreviousCard();

    instance.handleBackButtonClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should hide the back button, when told to', () => {
    instance.hideBackButton = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the next button, when told to', () => {
    instance.hideNextButton = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable next button, when told to', () => {
    instance.hideNextButton = false;
    instance.nextButtonEnabled = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
