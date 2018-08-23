import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockPayfactorsCompanyExchangeInvitation } from 'libs/models/peer';

import { PayfactorsCompanyExchangeInvitationsComponent } from './payfactors-company-exchange-invitations.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromPayfactorsCompanyExchangeInvitationsActions from '../../actions/payfactors-company-exchange-invitations.actions';

describe('Payfactors Company Exchange Invitations', () => {
  let fixture: ComponentFixture<PayfactorsCompanyExchangeInvitationsComponent>;
  let instance: PayfactorsCompanyExchangeInvitationsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

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

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
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

  it('should set collapse, selectedCompanyInvitation, and pageRowIndex correctly in the component when a cell is clicked', () => {
    instance.collapse = false;
    instance.pageRowIndex = null;
    instance.selectedCompanyInvitation = null;
    const mockInvite = generateMockPayfactorsCompanyExchangeInvitation();
    const event = { dataItem: mockInvite, rowIndex: 1};

    instance.handleCellClick(event);

    expect(instance.collapse).toBe(true);
    expect(instance.selectedCompanyInvitation).toEqual(mockInvite);
    expect(instance.pageRowIndex).toBe(1);
  });

  it('should set collapse to false and pageRowIndex to null after the company exchange invitation info is closed', () => {
    instance.collapse = true;
    instance.pageRowIndex = 1;

    instance.handleCloseInvitationInfo();

    expect(instance.collapse).toBe(false);
    expect(instance.pageRowIndex).toBeNull();
  });
});
