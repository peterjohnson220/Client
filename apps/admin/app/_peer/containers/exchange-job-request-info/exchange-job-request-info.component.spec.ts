import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeJobRequest } from 'libs/models/peer';

import { ExchangeJobRequestInfoComponent } from './exchange-job-request-info.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

describe('Exchange Job Request Info', () => {
  let fixture: ComponentFixture<ExchangeJobRequestInfoComponent>;
  let instance: ExchangeJobRequestInfoComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
      ],
      declarations: [
        ExchangeJobRequestInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeJobRequestInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedJobRequest = generateMockExchangeJobRequest();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a closeClicked event, when the close button is clicked', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.close-btn'));
    closeButton.triggerEventHandler('click', null);

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });

  it('should dispatch an OpenJobRequestApproveModal action, when the approve button is clicked', () => {
    const action = new fromExchangeJobRequestsActions.OpenJobRequestApproveModal();

    instance.approve();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a OpenJobRequestDenyModal action, when the deny button is clicked', () => {
    const action = new fromExchangeJobRequestsActions.OpenJobRequestDenyModal();

    instance.deny();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
