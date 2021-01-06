import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobBasedPageViewIds } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { AbstractFeatureFlagService, PermissionService, PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';

import * as fromJobBasedRangeReducer from '../../../../_job-based-range/shared/reducers';
import { StructuresPagesService } from '../../../../shared/services';
import { ModelGridComponent } from './model-grid.component';



class MockStructuresPagesService {
  modelPageViewId: BehaviorSubject<string>;
  constructor() {
    this.modelPageViewId = new BehaviorSubject<string>(JobBasedPageViewIds.ModelMinMidMax);
  }
}

describe('ModelGridComponent', () => {
  let instance: ModelGridComponent;
  let fixture: ComponentFixture<ModelGridComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobBased_main: combineReducers(fromJobBasedRangeReducer.reducers),
          pfDataGrids: combineReducers(fromPfGridReducer.reducers)
        }),
        PfCommonModule,
        NgbModule
      ],
      declarations: [ ModelGridComponent ],
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
        }
      ]
    });

    fixture = TestBed.createComponent(ModelGridComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    instance.roundingSettingsSub = of({}).subscribe();
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
