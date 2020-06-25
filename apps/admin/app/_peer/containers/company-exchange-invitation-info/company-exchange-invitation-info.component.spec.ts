import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { generateMockExchangeInvitation } from 'libs/models/peer';
import * as fromRootState from 'libs/state/state';

import { CompanyExchangeInvitationInfoComponent } from './company-exchange-invitation-info.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

describe('Company Exchange Invitation Info', () => {
  let fixture: ComponentFixture<CompanyExchangeInvitationInfoComponent>;
  let instance: CompanyExchangeInvitationInfoComponent;
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
        CompanyExchangeInvitationInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(CompanyExchangeInvitationInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedCompanyInvitation = generateMockExchangeInvitation();
  });

  it('info area should match snapshot', () => {
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

  it('should dispatch an OpenCompanyInvitationApproveModal action, when the approve button is clicked', () => {
    const action = new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationApproveModal();

    instance.approve();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an OpenCompanyInvitationDenyModal action, when the deny button is clicked', () => {
    const action = new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationDenyModal();

    instance.deny();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
