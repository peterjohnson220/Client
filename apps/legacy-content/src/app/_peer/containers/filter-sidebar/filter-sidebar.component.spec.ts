import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromPeerDataReducer from '../../reducers';
import { generateMockAggregateSelectionInfo } from '../../models';
import { FilterSidebarComponent } from './filter-sidebar.component';


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

    fixture.detectChanges();

    instance.handleAggregateToggled(generateMockAggregateSelectionInfo());

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  // Because we are importing the SwitchModule for the reasons described above the component will be rendered and
  // will cause snapshots to continually fail because of generated Ids changing. Putting this test on the back burner
  // for now. [BC]
  // it('should show a \'Metro\' label after the PayMarket\'s GeoValue when the GeoLabel is \'Metro\'', () => {
  //   fixture.detectChanges();
  //
  //   store.dispatch(new fromFilterSidebarActions.LoadPayMarketInformationSuccess(generateMockPayMarket()));
  //
  //   fixture.detectChanges();
  //
  //   expect(fixture).toMatchSnapshot();
  // });
});
