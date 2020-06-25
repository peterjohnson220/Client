import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { generateDefaultAsyncStateObj } from 'libs/models';

import { generateMockEntity } from '../../../_shared/models';

import * as fromDataInsightsMainReducer from '../../reducers';
import { DashboardsHeaderComponent } from './dashboards-header.component';
import { DashboardView } from '../../models';
import { CreateDataViewModalComponent } from '../create-data-view-modal';

describe('Data Insights - Dashboards Comopnent', () => {
  let instance: DashboardsHeaderComponent;
  let fixture: ComponentFixture<DashboardsHeaderComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        }),
        DropDownsModule
      ],
      declarations: [ DashboardsHeaderComponent, CreateDataViewModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SettingsService, useClass: SettingsService },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn(), patchValue: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(DashboardsHeaderComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should emit selectedDashboardViewChanged with correct selected view', () => {
    const view = DashboardView.All;
    spyOn(instance.selectedDashboardViewChanged, 'emit');

    instance.handleViewChanged(view);

    expect(instance.selectedDashboardViewChanged.emit).toHaveBeenCalledWith(view);
  });

  it('should open createDataViewModal when handling new report clicked', () => {
    instance.reportBuilderSettingEnabled = true;
    instance.baseEntitiesAsync$ = of(generateDefaultAsyncStateObj([generateMockEntity()]));
    fixture.detectChanges();

    spyOn(instance.createDataViewModal, 'open');
    instance.handleNewReportClicked();

    expect(instance.createDataViewModal.open).toHaveBeenCalled();
  });

});
