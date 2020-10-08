import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';


import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';

import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../reducers';
import { ComphubFooterComponent } from './footer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { generateMockFooterContext, generateMockPeerWorkflowContext, generateMockWorkflowContext } from '../../models';
import { environment } from 'environments/environment';

class DojGuidelinesStub {
  passing = true;

  get passesGuidelines(): boolean {
    return this.passing;
  }

  validateDataCut(selections: any) {
    return;
  }
}

describe('Comphub - Main - Footer', () => {
  let instance: ComphubFooterComponent;
  let fixture: ComponentFixture<ComphubFooterComponent>;
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
        { provide: DojGuidelinesService, useClass: DojGuidelinesStub },
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        }
      ],
      declarations: [ ComphubFooterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    const footerContext = {...generateMockFooterContext(), NextButtonEnabled: true};

    fixture = TestBed.createComponent(ComphubFooterComponent);
    instance = fixture.componentInstance;
    instance.footerContext$ = of(footerContext);
    instance.ngOnInit();
    store = TestBed.inject(Store);
    windowRef = TestBed.inject(WindowRef);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should dispatch a NavigateToNextCard action, when handling the next button click', () => {
    // arrange
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
    instance.footerContext.HideBackButton = true;
    instance.footerContext.PageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the next button, when told to', () => {
    instance.footerContext.HideNextButton = true;
    instance.footerContext.PageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable next button, when told to', () => {
    instance.footerContext.HideNextButton = false;
    instance.footerContext.NextButtonEnabled = false;
    instance.footerContext.PageTitle = 'Jobs';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
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
