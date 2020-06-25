import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockPayfactorsCompanyExchangeInvitation } from 'libs/models/peer';

import { PayfactorsCompanyExchangeInvitationsComponent } from './payfactors-company-exchange-invitations.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromPayfactorsCompanyExchangeInvitationsActions from '../../actions/payfactors-company-exchange-invitations.actions';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

describe('Payfactors Company Exchange Invitations', () => {
  let fixture: ComponentFixture<PayfactorsCompanyExchangeInvitationsComponent>;
  let instance: PayfactorsCompanyExchangeInvitationsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  const mockInvitation = generateMockPayfactorsCompanyExchangeInvitation();

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
        PayfactorsCompanyExchangeInvitationsComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { parent: { params: { id : 1 } } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.parent.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PayfactorsCompanyExchangeInvitationsComponent);
    instance = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadPayfactorsCompanyExchangeInvitations action ' +
           'when handlePayfactorsCompanyExchangeInvitationsGridReload is called', () => {
    const action = new fromPayfactorsCompanyExchangeInvitationsActions.LoadPayfactorsCompanyExchangeInvitations(routeIdParam);

    instance.handlePayfactorsCompanyExchangeInvitationsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an OpenCompanyInvitationInfo action when a cell is clicked', () => {
    const event = { dataItem: mockInvitation, rowIndex: 1};
    const action = new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationInfo({
      selectedCompanyInvitation: mockInvitation,
      pageRowIndex: 1
    });

    instance.handleCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseCompanyInvitationInfo action when the company invitation info is closed', () => {
    const action = new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationInfo();

    instance.handleCloseInvitationInfo();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ApproveCompanyExchangeInvitation action ' +
    'when handleApproveCompanyInvitation is called', () => {
    const expectedActionInfo = {
      reason: 'reason',
      peopleToNotify: 'peopleToNotify'
    };
    const action = new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation(expectedActionInfo);

    instance.handleApproveCompanyInvitation(expectedActionInfo);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a DenyCompanyExchangeInvitation action ' +
    'when handleDenyCompanyInvitation is called', () => {
    const reason = 'reason';
    const action = new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitation(reason);

    instance.handleDenyCompanyInvitation(reason);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseCompanyInvitationApproveModal action ' +
    'when handleCloseApproveModal is called', () => {
    const action = new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationApproveModal();

    instance.handleCloseApproveModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseCompanyInvitationDenyModal action ' +
    'when handleCloseDenyModal is called', () => {
    const action = new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationDenyModal();

    instance.handleCloseDenyModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
