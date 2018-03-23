import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockPayMarket } from 'libs/models';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromPeerDataReducer from '../../reducers';
import { generateMockAggregateSelectionInfo } from '../../models';
import { FilterSidebarComponent } from './filter-sidebar.component';
import { generateMockFilterAggregateGroup } from '../../../../../../../libs/models/peer/aggregate-filters';

describe('Legacy Content - Peer - Filter Sidebar Component', () => {
  let fixture: ComponentFixture<FilterSidebarComponent>;
  let instance: FilterSidebarComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerData: combineReducers(fromPeerDataReducer.reducers)
        }),

        // Even though we are doing shallow testing a weird error will occur with the kendo switch because one of
        // its inputs is prefixed with 'on'. Need to import the module to get the template to parse. [BC]
        SwitchModule
      ],
      declarations: [
        FilterSidebarComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FilterSidebarComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadPayMarketInformation action when initialized', () => {
    instance.companyPayMarketId = 123;
    const action = new fromFilterSidebarActions.LoadPayMarketInformation(instance.companyPayMarketId);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ToggleLimitToPayMarket action when the handleLimitToPayMarketToggled method is triggered', () => {
    const action = new fromFilterSidebarActions.ToggleLimitToPayMarket();

    fixture.detectChanges();

    instance.handleLimitToPayMarketToggled();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ToggleAggregateSelected action when the handleAggregateToggled method is triggered', () => {
    const payload = generateMockAggregateSelectionInfo();
    const action = new fromFilterSidebarActions.ToggleAggregateSelected(payload);

    // Give the store some data since it we be called through to.
    store.dispatch(new fromFilterSidebarActions.LoadingFilterAggregatesSuccess([generateMockFilterAggregateGroup()]));

    instance.handleAggregateToggled(generateMockAggregateSelectionInfo());

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should build a paymarket bounds filter label with \'Metro\' appended when the GeoLabel is \'Metro\'', () => {
    const filterLabel = instance.buildPayMarketBoundsFilterLabel(generateMockPayMarket());
    expect(filterLabel.split(' ').slice(-1)[0]).toBe('Metro');
  });
});
