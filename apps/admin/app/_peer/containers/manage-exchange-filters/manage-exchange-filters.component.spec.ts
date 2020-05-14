import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

import { of } from 'rxjs';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { SwitchModule } from '@progress/kendo-angular-inputs';

import * as fromRootState from 'libs/state/state';
import { ExchangeSearchFilterAggregate, generateMockExchange, generateMockExchangeSearchFilterAggregate } from 'libs/models/peer';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';

import { ManageExchangeFiltersComponent } from './manage-exchange-filters.component';
import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeFiltersActions from '../../actions/exchange-filters.actions';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';

describe('Manage Exchange Filters', () => {
  let fixture: ComponentFixture<ManageExchangeFiltersComponent>;
  let instance: ManageExchangeFiltersComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;
  let gridHelperService: GridHelperService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Even though we are doing shallow testing a weird error will occur with the kendo switch because one of
        // its inputs is prefixed with 'on'. Need to import the module to get the template to parse. [BG]
        SwitchModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
      ],
      declarations: [
        ManageExchangeFiltersComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { parent: { params: { id : 1 } } } }
        },
        {
          provide: GridHelperService,
          useValue: { loadExchangeFilters: jest.fn() }
        },
        {
          provide: UiPersistenceSettingsApiService,
          useValue: { getUiPersistenceSetting: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.parent.params.id;
    gridHelperService = TestBed.get(GridHelperService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ManageExchangeFiltersComponent);
    instance = fixture.componentInstance;

    instance.exchange$ = of(generateMockExchange());
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadExchangeFilters action when handleExchangeFiltersGridReload is called', () => {
    const action = new fromExchangeFiltersActions.LoadExchangeFilters({
      exchangeId: routeIdParam,
      searchString: ''
    });

    fixture.detectChanges();

    instance.handleExchangeFiltersGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a PutFilter action when handleSwitchToggled is called', () => {
    const filter = generateMockExchangeSearchFilterAggregate();
    const action = new fromExchangeFiltersActions.PutFilter(
      {...filter, IsDisabled: false}
    );

    fixture.detectChanges();

    instance.handleSwitchToggled(filter);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a PutFilter action when handleSaveFilterDisplayName is called', () => {
    const filter = {...generateMockExchangeSearchFilterAggregate(), IsDisabled: false};
    const expectedNewDisplayName = 'NewDisplayName';
    const expectedAction = new fromExchangeFiltersActions.PutFilter(
      {...filter, DisplayName: expectedNewDisplayName}
    );
    instance.exchangeFilters$ = of([filter]);

    fixture.detectChanges();

    instance.handleSaveFilterDisplayName(expectedNewDisplayName, filter.Id);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should call GridHelperService LoadExchangeFilters when handleSearchChanged is called', () => {
    const str = 'go';

    fixture.detectChanges();

    spyOn(gridHelperService, 'loadExchangeFilters');

    instance.handleSearchChanged(str);

    expect(gridHelperService.loadExchangeFilters).toHaveBeenCalledWith(instance.exchangeId, str);
  });

  it('should dispatch a ReorderFilters action when drop is called', () => {
    const filter = generateMockExchangeSearchFilterAggregate();
    const filters: ExchangeSearchFilterAggregate[] = [filter, filter];
    // Not crazy about this but it is the most straight forward way to mock the drag and drop event and test this method. [BG]
    const ddEvent: CdkDragDrop<string[]> = new class implements CdkDragDrop<string[]> {
      container: CdkDropList<string[]>;
      currentIndex = 1;
      isPointerOverContainer: boolean;
      item: CdkDrag;
      previousContainer: CdkDropList<string[]>;
      previousIndex = 1;
    };
    const action = new fromExchangeFiltersActions.ReorderFilters(filters);

    instance.exchangeFilters = filters;
    instance.drop(ddEvent);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a OpenAddTagCategoriesModal action when openAddTagCategoriesModal is called', () => {
    const action = new fromTagCategoriesActions.OpenAddTagCategoriesModal();

    fixture.detectChanges();

    instance.openAddTagCategoriesModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
