import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { generateMockExchangeInvitation } from 'libs/models/peer';
import * as fromRootState from 'libs/state/state';

import { CompanyExchangeInvitationInfoComponent } from './company-exchange-invitation-info.component';
import * as fromPeerAdminReducer from '../../reducers';

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

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(CompanyExchangeInvitationInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedCompanyInvitation = generateMockExchangeInvitation();
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

  it('should emit an approveClicked event, when the approve button is clicked', () => {
    // Spy on the emit method for the approveClicked EventEmitter
    spyOn(instance.approveClicked, 'emit');

    fixture.detectChanges();

    // Find the approve button in the template and trigger a click
    const approveButton = fixture.debugElement.query(By.css('.btn-success'));
    approveButton.triggerEventHandler('click', null);

    expect(instance.approveClicked.emit).toHaveBeenCalled();
  });

  it('should emit a denyClicked event, when the deny button is clicked', () => {
    // Spy on the emit method for the denyClicked EventEmitter
    spyOn(instance.denyClicked, 'emit');

    fixture.detectChanges();

    // Find the deny button in the template and trigger a click
    const denyButton = fixture.debugElement.query(By.css('.btn-danger'));
    denyButton.triggerEventHandler('click', null);

    expect(instance.denyClicked.emit).toHaveBeenCalled();
  });
});
