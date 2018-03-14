import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store, combineReducers, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeJobMapping, UpsertExchangeJobMapRequest } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingInfoComponent } from './exchange-job-mapping-info.component';

describe('Peer - Exchange Job Mapping Info', () => {
  let fixture: ComponentFixture<ExchangeJobMappingInfoComponent>;
  let instance: ExchangeJobMappingInfoComponent;

  let store: Store<fromPeerMainReducer.State>;
  const exchangeJobMappingMock = generateMockExchangeJobMapping();

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeJobMappingInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ExchangeJobMappingInfoComponent);
    instance = fixture.componentInstance;

    // Set up the store to already have a selected exchange job mapping
    store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(exchangeJobMappingMock));
  });

  it('should emit a closeClicked event, when the close button is clicked', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.close-btn'));
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

    store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(newExchangeJobMappingSelection));

    expect(instance.companyJobQuery).toBe('');
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action when a exchange job mapping that is not mapped is selected', () => {
    // Still need the actual implementation since we are making a setup call
    spyOn(store, 'dispatch').and.callThrough();

    instance.exchangeId = 1;
    fixture.detectChanges();

    // Update store to have a selected mapping that is not mapped
    const newExchangeJobMappingSelection = { ...exchangeJobMappingMock, Mapped: false };
    store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(newExchangeJobMappingSelection));

    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: instance.exchangeId,
      query: exchangeJobMappingMock.ExchangeJobTitle
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should build job models, when receiving a selected exchange job mapping', () => {
    fixture.detectChanges();

    const expectedExchangeJobInfo = {
      JobType: 'Exchange',
      JobTitle: exchangeJobMappingMock.ExchangeJobTitle,
      JobCode: exchangeJobMappingMock.ExchangeJobCode,
      JobFamily: exchangeJobMappingMock.ExchangeJobFamily,
      JobLevel: exchangeJobMappingMock.ExchangeJobLevel,
      JobDescription: exchangeJobMappingMock.ExchangeJobDescription
    };

    const expectedCompanyJobInfo = {
      JobType: 'Company',
      JobTitle: exchangeJobMappingMock.CompanyJobTitle,
      JobCode: exchangeJobMappingMock.CompanyJobCode,
      JobFamily: exchangeJobMappingMock.CompanyJobFamily,
      JobLevel: exchangeJobMappingMock.CompanyJobLevel,
      JobDescription: exchangeJobMappingMock.CompanyJobDescription
    };

    expect(instance.exchangeJobInfo).toEqual(expectedExchangeJobInfo);
    expect(instance.companyJobInfo).toEqual(expectedCompanyJobInfo);
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action, when handling the search value changing', () => {
    instance.exchangeId = 1;
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    const payload = { exchangeId: instance.exchangeId, query: 'Accountant' };
    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery(payload);
    instance.handleSearchValueChanged('Accountant');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ApplyMapping action, when handling an apply mapping event', () => {
    instance.exchangeId = 1;
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    const payload: UpsertExchangeJobMapRequest = {
      ExchangeJobToCompanyJobId: exchangeJobMappingMock.ExchangeJobToCompanyJobId,
      ExchangeId: instance.exchangeId,
      ExchangeJobId: exchangeJobMappingMock.ExchangeJobId,
      CompanyJobId: 234897
    };

    const expectedAction = new fromExchangeJobMappingInfoActions.ApplyMapping(payload);
    instance.handleApplyMapping(234897);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CancelEditMapping action, when we are editing a mapping and cancel editing is clicked', () => {
    fixture.detectChanges();

    store.dispatch(new fromExchangeJobMappingInfoActions.EditMapping());

    spyOn(store, 'dispatch');

    // Find the cancel editing button in the template and trigger a click
    const cancelEditingBtn = fixture.debugElement.query(By.css('.card-header .btn'));
    cancelEditingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.CancelEditMapping();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a EditMapping action, when clicking the edit mapping button', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    // Find the edit mapping button in the template and trigger a click
    const editMappingBtn = fixture.debugElement.query(By.css('.card-header .btn'));
    editMappingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.EditMapping();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadCompanyJobsToMapToByQuery action, when clicking the edit mapping button', () => {
    instance.exchangeId = 1;
    fixture.detectChanges();
    spyOn(store, 'dispatch');

    // Find the edit mapping button in the template and trigger a click
    const editMappingBtn = fixture.debugElement.query(By.css('.card-header .btn'));
    editMappingBtn.triggerEventHandler('click', null);

    const expectedAction = new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: instance.exchangeId,
      query: exchangeJobMappingMock.ExchangeJobTitle
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should display an edit mapping button, when the selected exchange job mapping is mapped', () => {
    // Mock Exchange Job Mapping set up above is mapped already.
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should NOT display an edit mapping button, when the selected exchange job mapping is not mapped', () => {
    exchangeJobMappingMock.Mapped = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
