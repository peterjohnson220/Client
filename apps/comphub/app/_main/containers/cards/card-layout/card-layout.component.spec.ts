import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';
import { environment } from 'environments/environment';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { CardLayoutComponent } from './card-layout.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { generateMockWorkflowContext, generateMockPeerWorkflowContext } from '../../../models';

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
    store = TestBed.inject(Store);
    windowRef = TestBed.inject(WindowRef);
    modalService = TestBed.inject(NgbModal);
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

  it('should set the window location to the default dashboard, when handling the confirm close app click for a enterprise quick price type', () => {
    instance.workflowContext = generateMockWorkflowContext();
    instance.handleConfirmedCloseApp();

    expect(windowRef.nativeWindow.location).toBe(`/${environment.hostPath}/dashboard`);
  });

  it('should set the window location to the peer dashboard, when handling the confirm close app click for a peer quick price type', () => {
    instance.workflowContext = generateMockPeerWorkflowContext();
    instance.handleConfirmedCloseApp();

    expect(windowRef.nativeWindow.location).toBe(`/${environment.hostPath}/peer/exchanges/redirect`);
  });

});
