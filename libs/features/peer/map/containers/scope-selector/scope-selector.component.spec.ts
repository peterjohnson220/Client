import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import { generateMockExchangeScopeItem } from 'libs/models/peer/exchange-scope';
import * as fromRootState from 'libs/state/state';
import * as fromLibsFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsExchangeScopeActions from 'libs/features/peer/map/actions/exchange-scope.actions';
import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';

import { ScopeSelectorComponent } from './scope-selector.component';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Features - Peer - Exchange Scope Selector Component', () => {
  let fixture: ComponentFixture<ScopeSelectorComponent>;
  let instance: ScopeSelectorComponent;
  let store: Store<fromLibsPeerMapReducer.State>;
  let router: Router;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule.forRoot(),
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_map: combineReducers(fromLibsPeerMapReducer.reducers)
        }),
      ],
      declarations: [
        ScopeSelectorComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(ScopeSelectorComponent);
    instance = fixture.componentInstance;

    instance.exchangeScopeItems$ = of([generateMockExchangeScopeItem()]);
  });

  it('should close the popover when clicking on an a scope', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    spyOn(instance.popover, 'close');

    instance.handleExchangeScopeClicked(generateMockExchangeScopeItem());

    expect(instance.popover.close).toHaveBeenCalled();
  });

  it('should dispatch a SetExchangeScopeSelection action when clicking on a scope', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsFilterSidebarActions.SetExchangeScopeSelection(exchangeScopeItem);

    instance.handleExchangeScopeClicked(exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a LoadExchangeScopeDetails action when clicking on a scope', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopeDetails();

    instance.handleExchangeScopeClicked(exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a LoadExchangeScopes action on init if the systemFilter has been loaded', () => {
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopes();
    instance.systemFilterLoaded$ = of(true);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should display the currently selected exchange scope', () => {
    instance.selectedExchangeScopeItem$ = of(generateMockExchangeScopeItem());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display "No Selection" message when there is no exchange scope selected', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should disable scope selector button when there are no scopes`, () => {
    instance.exchangeScopeItems$ = of([]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
