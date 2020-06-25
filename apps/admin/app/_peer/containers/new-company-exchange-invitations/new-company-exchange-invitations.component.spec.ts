import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockNewCompanyExchangeInvitation } from 'libs/models/peer';

import { NewCompanyExchangeInvitationsComponent } from './new-company-exchange-invitations.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromNewCompanyExchangeInvitationsActions from '../../actions/new-company-exchange-invitations.actions';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

describe('New Company Exchange Invitations', () => {
  let fixture: ComponentFixture<NewCompanyExchangeInvitationsComponent>;
  let instance: NewCompanyExchangeInvitationsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  const mockInvitation = generateMockNewCompanyExchangeInvitation();

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
        NewCompanyExchangeInvitationsComponent
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

    fixture = TestBed.createComponent(NewCompanyExchangeInvitationsComponent);
    instance = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadNewCompanyExchangeInvitations action ' +
    'when handleNewCompanyExchangeInvitationsGridReload is called', () => {
    const action = new fromNewCompanyExchangeInvitationsActions.LoadNewCompanyExchangeInvitations(routeIdParam);

    instance.handleNewCompanyExchangeInvitationsGridReload();

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
});
