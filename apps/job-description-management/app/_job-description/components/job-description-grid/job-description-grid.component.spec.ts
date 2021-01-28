import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatPurePipeModule } from 'ngx-date-fns';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdown, NgbModal, NgbPopoverModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';
import { PermissionService } from 'libs/core';
import { PfCommonModule } from 'libs/core';

import * as fromJobDescriptionReducers from '../../reducers';
import { JobDescriptionGridComponent } from './job-description-grid.component';
import { generateMockCompanyJobViewListItem } from '../../models';


describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: JobDescriptionGridComponent;
  let fixture: ComponentFixture<JobDescriptionGridComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        }),
        FormatPurePipeModule,
        PfCommonModule
      ],
      declarations: [
        JobDescriptionGridComponent, NgbDropdown,  NgbTooltip
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: jest.fn(() => true) }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionGridComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
  });

  it('should emit companyJobViewListItem found at specified rowIndex, when calling handleRowClick', () => {
    spyOn(instance.navigateToJobDescription, 'emit');

    const mockedCompanyJobViewListItem1 = generateMockCompanyJobViewListItem(1);
    const mockedCompanyJobViewListItem2 = generateMockCompanyJobViewListItem(2);

    instance.gridDataResult = { data: [cloneDeep(mockedCompanyJobViewListItem1), cloneDeep(mockedCompanyJobViewListItem2)], total: 2 };

    instance.handleRowClick({ ctrlKey: false, deselectedRows: [], selectedRows: [{ index: 1, dataItem: mockedCompanyJobViewListItem2 }]});

    expect(instance.navigateToJobDescription.emit).toHaveBeenLastCalledWith(mockedCompanyJobViewListItem2);
  });

  it('should emit job description data, when calling handleJobDescriptionHistoryClick', () => {
    spyOn(instance.openJobDescriptionHistoryModal, 'emit');

    const mockedJobDescriptionId = 1;
    const mockedJobTitle = 'Test Job Title';

    instance.handleJobDescriptionHistoryClick(mockedJobDescriptionId, mockedJobTitle);

    const expectedEmitData = { jobDescriptionId: mockedJobDescriptionId, jobTitle: mockedJobTitle };

    expect(instance.openJobDescriptionHistoryModal.emit).toHaveBeenLastCalledWith(expectedEmitData);
  });

  it('should emit company job view list item data, when calling handleNewJobDescriptionClick', () => {
    spyOn(instance.openNewJobDescriptionModal, 'emit');

    const mockedCompanyJobViewListItem = generateMockCompanyJobViewListItem();

    instance.handleNewJobDescriptionClick(cloneDeep(mockedCompanyJobViewListItem));

    expect(instance.openNewJobDescriptionModal.emit).toHaveBeenLastCalledWith(mockedCompanyJobViewListItem);
  });
});
