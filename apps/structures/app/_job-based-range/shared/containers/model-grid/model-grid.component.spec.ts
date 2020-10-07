import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { AbstractFeatureFlagService, PermissionService, PfCommonModule } from 'libs/core';

import * as fromJobBasedRangeReducer from '../../reducers';
import { ModelGridComponent } from './model-grid.component';
import { RangeValuePipe } from '../../pipes';
import { PageViewIds } from '../../constants/page-view-ids';
import { Pages } from '../../constants/pages';
import * as fromPublishModelModalActions from '../../actions/publish-model-modal.actions';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import { StructuresPagesService } from '../../services';

class MockStructuresPagesService {
  modelPageViewId: BehaviorSubject<string>;
  constructor() {
    this.modelPageViewId = new BehaviorSubject<string>(PageViewIds.ModelMinMidMax);
  }
}

describe('Job Range Structures - Model page', () => {
  let instance: ModelGridComponent;
  let fixture: ComponentFixture<ModelGridComponent>;
  let store: Store<fromJobBasedRangeReducer.State>;
  let ngbModal: NgbModal;

  beforeEach(() => {
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
        }
      ]
    });

    fixture = TestBed.createComponent(ModelGridComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    instance.roundingSettingsSub = of({}).subscribe();
  });

  it('should dispatch the loadData action when mid is updated from the employees page', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromPfGridActions.LoadData(PageViewIds.Employees);
    const metainfo = { page: Pages.Employees };
    instance.updateMidSuccessCallbackFn(instance.store, metainfo);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the loadData action when mid is updated from the pricings page', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromPfGridActions.LoadData(PageViewIds.Pricings);
    const metainfo = { page: Pages.Pricings };
    instance.updateMidSuccessCallbackFn(instance.store, metainfo);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch the loadData action when mid is updated from the model page', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromPfGridActions.LoadData(PageViewIds.Pricings);
    const metainfo = { page: Pages.Model };
    instance.updateMidSuccessCallbackFn(instance.store, metainfo);

    expect(instance.store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the openModal action when handlePublishModelClicked is called', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromPublishModelModalActions.OpenModal();

    instance.handlePublishModelClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the openModal action when handleModelSettingsClicked is called', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromModelSettingsModalActions.OpenModal();

    instance.handleModelSettingsClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should emit the addJobs event if handleAddJobsClicked is clicked', () => {
    spyOn(instance.addJobs, 'emit');


    instance.handleAddJobsClicked();

    expect(instance.addJobs.emit).toHaveBeenCalled();
  });



});
