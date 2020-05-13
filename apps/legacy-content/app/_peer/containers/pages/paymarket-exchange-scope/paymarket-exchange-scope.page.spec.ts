import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { generateMockExchangeScopeItem } from 'libs/models/peer/exchange-scope';

import * as fromPaymarketExchangeScopeActions from '../../../actions/paymarket-exchange-scope.actions';
import { PaymarketExchangeScopeComponent } from './paymarket-exchange-scope.page';

describe('Legacy Content - Peer - PayMarket Exchange Scope', () => {
  let fixture: ComponentFixture<PaymarketExchangeScopeComponent>;
  let instance: PaymarketExchangeScopeComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRoute;
  const queryStringParams = { companyPayMarketId: 12345 };

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot( {
          ...fromRootState.reducers
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue : {
            snapshot: { queryParamMap: { get: (key) => queryStringParams[key] } }
          }
        }
      ],
      declarations: [
        PaymarketExchangeScopeComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PaymarketExchangeScopeComponent);
    instance = fixture.componentInstance;
  });

  it('should display the PayMarket exchange Scope page', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the LoadExchangeScopes action on page init', () => {
    const expectedAction = new fromPaymarketExchangeScopeActions.LoadExchangeScopes();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the LoadExchangeScopesSelection action on page init', () => {
    const expectedAction = new fromPaymarketExchangeScopeActions.LoadExchangeScopeSelections(12345);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the add row action when clicking add row button', () => {
    const expectedAction = new fromPaymarketExchangeScopeActions.AddRow();

    fixture.detectChanges();
    instance.addRow();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the delete row action when clicking delete row button', () => {
    const expectedAction = new fromPaymarketExchangeScopeActions.DeleteRow(0);

    fixture.detectChanges();
    instance.addRow();
    instance.deleteRow(0);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the SelectExchange action when exchange is selected', () => {

    const expectedActions = new fromPaymarketExchangeScopeActions.SelectExchange({ Row: 0, ExchangeId : 1 });

    fixture.detectChanges();
    instance.addRow();
    instance.selectExchange(0, {Key: 1, Value: 'Exchange 1'});

    expect(store.dispatch).toHaveBeenCalledWith(expectedActions);
  });

  it('should dispatch the SelectScope action when scope is selected', () => {

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectedActions =
      new fromPaymarketExchangeScopeActions.SelectScope({ Row: 0, ScopeId: exchangeScopeItem.Id });
    instance.selectScope(0, exchangeScopeItem);
    expect(store.dispatch).toHaveBeenCalledWith(expectedActions);
  });

});
