import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockCompanyJobMapping, generateMockExchangeJobMapping, UpsertExchangeJobMapRequest } from 'libs/models/peer';
import { generateMockLatestCompanyJob } from 'libs/models/common';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../reducers';
import { ExchangeJobMappingInfoComponent } from './exchange-job-mapping-info.component';
import {GridDataResult} from '@progress/kendo-angular-grid';

describe('Peer - Exchange Job Mapping Info', () => {
  let fixture: ComponentFixture<ExchangeJobMappingInfoComponent>;
  let instance: ExchangeJobMappingInfoComponent;

  let store: Store<fromPeerManagementReducer.State>;
  const exchangeJobMappingMock = generateMockExchangeJobMapping();
  const mockCarousel: any = { next: jest.fn(), prev: jest.fn(), select: jest.fn() };

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeJobMappingInfoComponent,
        NgbSlide
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(ExchangeJobMappingInfoComponent);
    instance = fixture.componentInstance;

    instance.carousel = mockCarousel;
    // Set up the store to already have a selected exchange job mapping
    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(exchangeJobMappingMock));
  });

  it('should emit a closeClicked event, when the close button is clicked', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.close-panel'));
    closeButton.triggerEventHandler('click', null);

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });


  it('should set the selectedExchangeJobMapping to the selected mapping from the store', () => {
    fixture.detectChanges();

    expect(instance.selectedExchangeJobMapping).toBe(exchangeJobMappingMock);
  });

  it('should set the companyJobQuery to an empty string when a new exchange job mapping is selected', () => {
    fixture.detectChanges();

    instance.companyJobQuery = 'Blah Blah Blah';

    const newExchangeJobMappingSelection = { ...exchangeJobMappingMock, ExchangeJobId: 3983457 };

    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(newExchangeJobMappingSelection));

    expect(instance.companyJobQuery).toBe('');
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action when a exchange job mapping that is not mapped is selected', () => {
    // Still need the actual implementation since we are making a setup call
    spyOn(store, 'dispatch');

    instance.exchangeId = 1;
    fixture.detectChanges();

    // Update store to have a selected mapping that is not mapped
    const newExchangeJobMappingSelection = { ...exchangeJobMappingMock, CompanyJobMappings: null };
    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(newExchangeJobMappingSelection));

    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: instance.exchangeId,
      jobTitleAndCodeQuery: exchangeJobMappingMock.ExchangeJobTitle,
      jobDescriptionQuery: ''
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should build job models, when receiving a mapped company job', () => {
    fixture.detectChanges();

    const mappedCompanyJobs = generateMockLatestCompanyJob();

    store.dispatch(new fromExchangeJobMappingInfoActions.LoadMappedCompanyJobsSuccess([mappedCompanyJobs]));

    expect(instance.selectedJobs).toEqual([mappedCompanyJobs]);
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action, when handling the search value changing', () => {
    instance.exchangeId = 1;
    instance.companyJobQuery = 'Accountant';
    instance.companyDescriptionQuery = 'Job Description';
    spyOn(store, 'dispatch');

    const payload = { exchangeId: instance.exchangeId, jobTitleAndCodeQuery: 'Accountant', jobDescriptionQuery: 'Job Description' };
    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery(payload);
    instance.searchChanged();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ApplyMapping action, when handling an apply mapping event', () => {
    instance.exchangeId = 1;
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    const payload: UpsertExchangeJobMapRequest = {
      ExchangeId: instance.exchangeId,
      ExchangeJobId: exchangeJobMappingMock.ExchangeJobId,
      CompanyJobId: 234897
    };

    const expectedAction = new fromExchangeJobMappingInfoActions.ApplyMapping(payload);
    instance.handleApplyMapping(234897);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CancelAddMapping action, when we are adding a mapping and cancel adding is clicked', () => {
    fixture.detectChanges();

    store.dispatch(new fromExchangeJobMappingInfoActions.AddMapping());

    spyOn(store, 'dispatch');

    // Find the cancel editing button in the template and trigger a click
    const cancelEditingBtn = fixture.debugElement.query(By.css('.card-header #add-mapping-button'));
    cancelEditingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.CancelAddMapping();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a AddMapping action, when clicking the add mapping button', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    // Find the edit mapping button in the template and trigger a click
    const editMappingBtn = fixture.debugElement.query(By.css('.card-header #add-mapping-button'));
    editMappingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.AddMapping();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action, when clicking the add mapping button', () => {
    instance.exchangeId = 1;
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    // Find the edit mapping button in the template and trigger a click
    const editMappingBtn = fixture.debugElement.query(By.css('.card-header #add-mapping-button'));
    editMappingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: instance.exchangeId,
      jobTitleAndCodeQuery: exchangeJobMappingMock.ExchangeJobTitle,
      jobDescriptionQuery: ''
    });
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should display an add mapping button, when the selected exchange job mapping is mapped', () => {
    // Mock Exchange Job Mapping set up above is mapped already.
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should NOT display an add mapping button, when the selected exchange job mapping is not mapped', () => {
    const unmappedExchangeJobMock = { ...exchangeJobMappingMock, Mapped: false };

    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(unmappedExchangeJobMock));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a carousel when more than one company job is mapped', () => {

    const exchangeJobMapping = generateMockExchangeJobMapping();
    const exchangeJobMappings = [{exchangeJobMapping}, {...exchangeJobMapping}];
    const grid: GridDataResult = {data: exchangeJobMappings, total: exchangeJobMappings.length};
    store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsSuccess(grid));
    fixture.detectChanges();
    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(exchangeJobMapping));
    fixture.detectChanges();
    const latestJob = generateMockLatestCompanyJob();
    const latestJobs = [latestJob, { ...latestJob, CompanyJobId: 234234 }];

    instance.selectedExchangeJobMapping = {...generateMockExchangeJobMapping(), Mapped: true};
    store.dispatch(new fromExchangeJobMappingInfoActions.LoadMappedCompanyJobsSuccess(latestJobs));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should NOT dispatch SetActiveMapping with the ExchangeJobToCompanyJobId of the first company job mapping on init
  when there are NO companyJobMappings`, () => {
      const mockCompanyJobMapping = generateMockCompanyJobMapping();
      const exchangeJobMappingWithMultipleMappingsMock = { ...exchangeJobMappingMock, CompanyJobMappings: [] };
      const expectedAction = new fromExchangeJobMappingInfoActions.SetActiveMapping(mockCompanyJobMapping.ExchangeJobToCompanyJobId);

      store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(exchangeJobMappingWithMultipleMappingsMock));

      spyOn(store, 'dispatch');

      fixture.detectChanges();

      expect(store.dispatch).not.toBeCalledWith(expectedAction);
    });

  // TODO: Needs to be re-written, selectedCompanyJob does not match the mock type
  // it(`should NOT dispatch SetActiveMapping with the ExchangeJobToCompanyJobId of the first company job mapping on init
  // when the selectedCompanyJobMapping is no longer mapped`, () => {
  //     const mockCompanyJobMapping = generateMockCompanyJobMapping();
  //     const companyJobMappings = [mockCompanyJobMapping, { ...mockCompanyJobMapping, ExchangeJobToCompanyJobId: 2 }];
  //     const exchangeJobMappingWithMultipleMappingsMock = { ...exchangeJobMappingMock, CompanyJobMappings: companyJobMappings };
  //     const expectedAction = new fromExchangeJobMappingInfoActions.SetActiveMapping(mockCompanyJobMapping.ExchangeJobToCompanyJobId);
  //
  //     instance.selectedCompanyJob = mockCompanyJobMapping;
  //     store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(exchangeJobMappingWithMultipleMappingsMock));
  //
  //     spyOn(store, 'dispatch');
  //
  //     fixture.detectChanges();
  //
  //     expect(store.dispatch).not.toBeCalledWith(expectedAction);
  //   });

  it(`should update selectedCompanyJob when the activeExchangeJobToCompanyJobId$ is changed`, () => {
    const mockCompanyJob = generateMockLatestCompanyJob();
    const companyJobMappings = [mockCompanyJob, { ...mockCompanyJob, CompanyJobId: 345 }];
    const expectedCompanyJobMapping = companyJobMappings[0];

    const mockExchangeJobMapping = generateMockExchangeJobMapping();

    store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(mockExchangeJobMapping));

    fixture.detectChanges();

    store.dispatch((new fromExchangeJobMappingInfoActions.LoadMappedCompanyJobsSuccess(companyJobMappings)));

    fixture.detectChanges();

    expect(instance.selectedCompanyJob).toEqual(expectedCompanyJobMapping);
  });

  it(`should dispatch an OpenDeleteConfirmationModal action when handleDeleteClick is triggered`, () => {
    const expectedAction = new fromExchangeJobMappingInfoActions.OpenDeleteConfirmationModal();

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleDeleteClick();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should call carousel.next when handleControlRightClick is triggered`, () => {
    spyOn(instance.carousel, 'next');

    fixture.detectChanges();

    instance.carousel = mockCarousel;

    instance.handleControlRightClick();

    expect(instance.carousel.next).toBeCalled();
  });

  it(`should call carousel.prev when handleControlLeftClick is triggered`, () => {
    spyOn(instance.carousel, 'prev');

    fixture.detectChanges();

    instance.carousel = mockCarousel;

    instance.handleControlLeftClick();

    expect(instance.carousel.prev).toBeCalled();
  });

  it(`should call carousel.select when handleIndicatorClick is triggered`, () => {
    const expectedSlideId = exchangeJobMappingMock.CompanyJobMappings[0].ExchangeJobToCompanyJobId.toString();

    spyOn(instance.carousel, 'select');

    fixture.detectChanges();

    instance.carousel = mockCarousel;

    instance.handleIndicatorClick(expectedSlideId);

    expect(instance.carousel.select).toBeCalledWith(expectedSlideId);
  });

  it(`should dispatch a SetActiveMapping action with the slide event's current value when onCarouselSlideChange is triggered`, () => {
    const expectedSlideId = exchangeJobMappingMock.CompanyJobMappings[0].ExchangeJobToCompanyJobId;
    const expectedAction = new fromExchangeJobMappingInfoActions.SetActiveMapping(expectedSlideId);
    const mockSlideEvent: NgbSlideEvent = {
      paused: false,
      current: expectedSlideId.toString(),
      direction: null,
      prev: '0'
    };

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.onCarouselSlideChange(mockSlideEvent);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
