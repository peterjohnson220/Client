import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdown, NgbModal, NgbPopoverModule, NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../reducers';
import { JobDescriptionGridComponent } from './job-description-grid.component';
import { generateMockCompanyJobViewListItem } from '../../models';
import { MomentModule } from 'angular2-moment';
import { PermissionService } from 'libs/core';
import { TruncateAfterPipe } from 'libs/core/pipes';


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
        MomentModule
      ],
      declarations: [
        JobDescriptionGridComponent, NgbDropdown,  NgbTooltip, TruncateAfterPipe
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

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

  it('should emit companyJobViewListItem found at specified rowIndex, when calling handleRowClick', () => {
    spyOn(instance.navigateToJobDescription, 'emit');

    const mockedCompanyJobViewListItem1 = generateMockCompanyJobViewListItem(1);
    const mockedCompanyJobViewListItem2 = generateMockCompanyJobViewListItem(2);

    instance.gridDataResult = { data: [cloneDeep(mockedCompanyJobViewListItem1), cloneDeep(mockedCompanyJobViewListItem2)], total: 2 };

    instance.handleRowClick({index: 1, selectedRows: [{ dataItem: mockedCompanyJobViewListItem2 }]});

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
