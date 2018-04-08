import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromAddDataCutActions from '../../../actions/add-data-cut-page.actions';
import * as fromPeerMapActions from '../../../actions/map.actions';
import * as fromPeerDataReducer from '../../../reducers';
import { AddDataCutPageComponent } from './add-data-cut.page';
import {
  generateMockExchangeMapResponse,
  generateMockExchangeStatCompanyMakeup
} from '../../../../../../../../libs/models/peer';

describe('Legacy Content - Peer - Add Data Cut', () => {
  let fixture: ComponentFixture<AddDataCutPageComponent>;
  let instance: AddDataCutPageComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRouteStub;
  const queryStringParams = { companyPayMarketId: 1, companyJobId: 2, userSessionId: 3 };

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerData: combineReducers(fromPeerDataReducer.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub,
        }
      ],
      declarations: [
        AddDataCutPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    route.testParamMap = queryStringParams;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddDataCutPageComponent);
    instance = fixture.componentInstance;
  });

  it('should display the add data cut page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the adding data cut action when clicking add', () => {
    const expectedAction = new fromAddDataCutActions.AddingDataCut({
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId,
      UserSessionId: queryStringParams.userSessionId
    });

    fixture.detectChanges();
    instance.add();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the cancel action when clicking cancel', () => {
    const expectedAction = new fromAddDataCutActions.CancelAddDataCut();

    instance.cancel();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should enable the add button when the map data contains more than the MinCompanies', () => {
    const mapResponse = generateMockExchangeMapResponse();

    mapResponse.MapSummary.OverallMapStats.Companies =
      Array(instance.guidelineLimits.MinCompanies)
      .fill(generateMockExchangeStatCompanyMakeup());

    store.dispatch(new fromPeerMapActions.LoadingPeerMapSuccess(mapResponse));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
