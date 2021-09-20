import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { generateMockExchangeScopeItem } from 'libs/models/peer/exchange-scope';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { ExchangeScopeSelectorComponent } from './exchange-scope-selector.component';
import * as fromLibsExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';
import * as fromLibsExchangeScopeActions from '../../actions/exchange-scope.actions';
import * as fromExchangeExplorerReducer from '../../reducers';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Features - Peer - Exchange Scope Selector Component', () => {
  let fixture: ComponentFixture<ExchangeScopeSelectorComponent>;
  let instance: ExchangeScopeSelectorComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_peer_exchangeExplorer: combineReducers(fromExchangeExplorerReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeScopeSelectorComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: SettingsService,
          useValue: { selectUiPersistenceSettingFromDictionary: of }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExchangeScopeSelectorComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);

    instance.exchangeScopeItems$ = of([generateMockExchangeScopeItem()]);

    fixture.detectChanges();
  });

  it('should load the exchange scope selector with default options', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should load the exchange scope selector popover when there are exchange scopes', () => {
    instance.exchangeScopeItems = [generateMockExchangeScopeItem()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should close the popover when clicking on an a scope', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    jest.spyOn(instance.popover, 'close');

    instance.handleExchangeScopeClicked(event, generateMockExchangeScopeItem());

    expect(instance.popover.close).toHaveBeenCalled();
  });

  it('should not close the popover when clicking on an a scope and in delete mode', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');
    instance.deleteMode = true;

    fixture.detectChanges();

    jest.spyOn(instance.popover, 'close');

    instance.handleExchangeScopeClicked(event, generateMockExchangeScopeItem());

    expect(instance.popover.close).not.toHaveBeenCalled();
  });

  it('should dispatch a SetExchangeScopeSelection action when clicking on a scope', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeFilterContextActions.SetExchangeScopeSelection(exchangeScopeItem);

    instance.handleExchangeScopeClicked(event, exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should not dispatch a SetExchangeScopeSelection action when clicking on a scope if in delete mode', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');
    instance.deleteMode = true;

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeFilterContextActions.SetExchangeScopeSelection(exchangeScopeItem);

    instance.handleExchangeScopeClicked(event, exchangeScopeItem);

    expect(store.dispatch).not.toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a LoadExchangeScopeDetails action when clicking on a scope', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopeDetails();

    instance.handleExchangeScopeClicked(event, exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should not dispatch a LoadExchangeScopeDetails action when clicking on a scope and in delete mode', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');
    instance.deleteMode = true;

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopeDetails();

    instance.handleExchangeScopeClicked(event, exchangeScopeItem);

    expect(store.dispatch).not.toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a LoadExchangeScopesByJobs action on init if the systemFilter has been loaded and we are in the ' +
           'add data cuts modal', () => {
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs();
    instance.systemFilterLoaded$ = of(true);
    instance.isExchangeJobSpecific = true;

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a LoadExchangeScopesByExchange action on init if the systemFilter has been loaded and we are not in the' +
           'add data cuts modal', () => {
    const exchangeId = 1;
    const expectAction = new fromLibsExchangeScopeActions.LoadExchangeScopesByExchange() ;
    instance.systemFilterLoaded$ = of(true);
    instance.isExchangeJobSpecific = false;
    instance.exchangeId = exchangeId;

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should display the currently selected exchange scope', () => {
    instance.selectedExchangeScopeItem$ = of(generateMockExchangeScopeItem());
    instance.isExchangeJobSpecific = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display "No Selection" message when there is no exchange scope selected', () => {
    instance.isExchangeJobSpecific = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should disable scope selector button when there are no scopes`, () => {
    instance.exchangeScopeItems$ = of([]);
    instance.isExchangeJobSpecific = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should match snapshot when in add data cuts modal', () => {
    instance.isExchangeJobSpecific = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should match snapshot when on big exchange-explorer-map', () => {
    instance.isExchangeJobSpecific = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a SetExchangeScopeToDelete action when clicking on a delete icon', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeScopeActions.SetExchangeScopeToDelete(exchangeScopeItem);

    instance.enterDeleteScopeMode(event, exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a EnterDeleteExchangeScopeMode action when clicking on a delete icon', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const exchangeScopeItem = generateMockExchangeScopeItem();
    const expectAction = new fromLibsExchangeScopeActions.EnterDeleteExchangeScopeMode();

    instance.enterDeleteScopeMode(event, exchangeScopeItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch an ExitDeleteExchangeScopeMode action when clicking on the cancel delete button', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const expectAction = new fromLibsExchangeScopeActions.ExitDeleteExchangeScopeMode();

    instance.cancelDeleteScope(event);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a SetExchangeScopeToDelete action when clicking on the cancel delete button', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    const expectAction = new fromLibsExchangeScopeActions.SetExchangeScopeToDelete(null);

    instance.cancelDeleteScope(event);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should dispatch a DeleteExchangeScope action when clicking on the delete scope button', () => {
    const event = new MouseEvent('click');
    jest.spyOn(store, 'dispatch');
    const exchangeScopeItem = generateMockExchangeScopeItem();
    instance.scopeToDelete = exchangeScopeItem;

    fixture.detectChanges();

    const expectAction = new fromLibsExchangeScopeActions.DeleteExchangeScope({ scopeId: exchangeScopeItem.ExchangeScopeId, isStandardScope: false } );

    instance.deleteScope(event);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('highlight should be true when the scope ids match', () => {
    const exchangeScopeItem = generateMockExchangeScopeItem();
    instance.scopeToDelete = exchangeScopeItem;
    fixture.detectChanges();

    const highlight = instance.highlightScope(exchangeScopeItem);

    expect(highlight).toBe(true);
  });

  it('highlight should be false when the scope ids do not match', () => {
    const exchangeScopeItem = generateMockExchangeScopeItem();
    instance.scopeToDelete = exchangeScopeItem;
    fixture.detectChanges();

    exchangeScopeItem.ExchangeScopeId = 2;
    const highlight = instance.highlightScope(exchangeScopeItem);

    expect(highlight).toBe(true);
  });

  it('should set the filtered exchange scopes to be the full list of exchange scopes, when showing the popover', () => {
    instance.exchangeScopeItems = [
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 1},
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 2}
    ];

    instance.handlePopoverShown();

    expect(instance.exchangeScopeItems).toHaveLength(2);
    expect(instance.exchangeScopeItems[0].ExchangeScopeId).toBe(1);
    expect(instance.exchangeScopeItems[1].ExchangeScopeId).toBe(2);
  });

  it('it should dispatch SetExchangeScopeNameFilter action when search value is changed', () => {
    instance.exchangeScopeItems = [
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 1, Name: 'ItemOneItem'},
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 2, Name: 'ItemTwoItem'}
    ];
    jest.spyOn(store, 'dispatch');

    instance.handleSearchValueChanged('Two');

    const expectAction = new fromLibsExchangeScopeActions.SetExchangeScopeNameFilter('two');

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('it should dispatch SetExchangeScopes with empty array when search value is changed', () => {
    instance.exchangeScopeItems = [
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 1, Name: 'ItemONEItem'},
      {...generateMockExchangeScopeItem(), ExchangeScopeId: 2, Name: 'ItemTWOItem'}
    ];
    jest.spyOn(store, 'dispatch');

    instance.handleSearchValueChanged('one');

    const expectAction = new fromLibsExchangeScopeActions.SetExchangeScopes([]);

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should track by the exchange scope item id', () => {
    const result = instance.trackByFn(generateMockExchangeScopeItem());

    expect(result).toBe(1);
  });
});
