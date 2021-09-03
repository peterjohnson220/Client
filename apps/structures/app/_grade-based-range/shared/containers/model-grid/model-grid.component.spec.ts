import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

import { AbstractFeatureFlagService, PermissionService, PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';
import { generateMockAdjustMidpointSetting, generateMockRangeAdvancedSetting, generateMockRangeDistributionSettingForm, GradeBasedPageViewIds } from 'libs/models/structures';
import { generateMockStructureRangeDistributionTypes } from 'libs/models/payfactors-api/structures/response';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { RangeValuePipe } from 'libs/features/structures/add-jobs-to-range/pipes';

import { StructuresPagesService, UrlService } from '../../../../shared/services';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import { ModelGridComponent } from './model-grid.component';

class MockStructuresPagesService {
  modelPageViewId: BehaviorSubject<string>;
  constructor() {
    this.modelPageViewId = new BehaviorSubject<string>(GradeBasedPageViewIds.ModelMinMidMax);
  }
}

describe('ModelGridComponent', () => {
  let instance: ModelGridComponent;
  let fixture: ComponentFixture<ModelGridComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;
  let urlService: UrlService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          pfDataGrids: combineReducers(fromPfGridReducer.reducers)
        }),
        PfCommonModule,
        NgbModule
      ],
      declarations: [ ModelGridComponent, RangeValuePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: jest.fn()}
        },
        {
          provide: StructuresPagesService,
          useClass: MockStructuresPagesService
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn() }
        },
        {
          provide: UrlService,
          useValue: { isInWorkflow: jest.fn() }
        },
      ]
    });

    fixture = TestBed.createComponent(ModelGridComponent);
    instance = fixture.componentInstance;
    instance.metaData = {
      Paymarket: 'Boston',
      PaymarketId: 1,
      StructureName: 'testStruc',
      ModelName: 'testModel',
      Currency: 'USD',
      Rate: 'Annual',
      PayType: 'Base',
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      SpreadMin: 10,
      SpreadMax: 10,
      IsCurrent: false,
      RangeDistributionTypeId: 1,
      RangeTypeId: 2,
      ExchangeId: null,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSettingForm(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting(),
      MidpointProgression: 5,
      StartingMidpoint: 55555,
      AdjustMidpointSetting: generateMockAdjustMidpointSetting()
    };
    instance.rangeGroupId = 100;
    instance.rangeIdToRemove = 200;
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    urlService = TestBed.inject(UrlService);
    instance.roundingSettingsSub = of({}).subscribe();
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch RemovingRange action', () => {
    jest.spyOn(store, 'dispatch');

    const request = {
      StructuresRangeId: instance.rangeIdToRemove, 
      StructuresRangeGroupId: instance.rangeGroupId,
      IsCurrent: instance.metaData.IsCurrent,
      IsJobRange: false
    }

    const expectedAction = new fromSharedStructuresActions.RemovingRange(request);
    instance.removeRange();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
