import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';
import { environment } from 'environments/environment';
import { generateMockUserContext } from 'libs/models/security';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { CardLayoutComponent } from './card-layout.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('Comphub - Main - Card Layout', () => {
  let instance: CardLayoutComponent;
  let fixture: ComponentFixture<CardLayoutComponent>;
  let store: Store<fromComphubMainReducer.State>;
  let windowRef: WindowRef;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      providers: [
        {
          provide: WindowRef,
          useValue: { nativeWindow: { location: jest.fn() } }
        },
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        }
      ],
      declarations: [ CardLayoutComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CardLayoutComponent);
    instance = fixture.componentInstance;
    instance.userContext$ = of(generateMockUserContext());
    store = TestBed.get(Store);
    windowRef = TestBed.get(WindowRef);
    modalService = TestBed.get(NgbModal);
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
    instance.pageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the next button, when told to', () => {
    instance.hideNextButton = true;
    instance.pageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable next button, when told to', () => {
    instance.hideNextButton = false;
    instance.nextButtonEnabled = false;
    instance.pageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should open the modal via the modal service when handling a close button click', () => {
    spyOn(modalService, 'open');
    instance.handleCloseClicked();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should set the window location to the dashboard, when handling the confirm close app click', () => {
    instance.handleConfirmedCloseApp();

    expect(windowRef.nativeWindow.location).toBe(`/${environment.hostPath}/dashboard`);
  });

});
