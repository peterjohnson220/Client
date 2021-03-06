import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GradeBasedPageViewIds } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { AbstractFeatureFlagService, PermissionService, PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';
import { RangeValuePipe } from 'libs/features/structures/add-jobs-to-range/pipes';

import { StructuresPagesService, UrlService } from '../../../../shared/services';
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
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    urlService = TestBed.inject(UrlService);
    instance.roundingSettingsSub = of({}).subscribe();
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
