import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { HighlightTextPipe, JobDescriptionParserPipe } from 'libs/core/pipes';
import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromCompanyJobsActions from '../../actions/company-jobs.actions';
import * as fromCompanyJobsReducer from '../../reducers';
import { CompanyJobsComponent } from './company-jobs.component';

describe('CompanyJobsComponent', () => {
  let component: CompanyJobsComponent;
  let fixture: ComponentFixture<CompanyJobsComponent>;
  let store: Store<fromCompanyJobsReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_association: combineReducers(fromCompanyJobsReducer.reducers)
        }),
      ],
      declarations: [ CompanyJobsComponent, HighlightTextPipe, JobDescriptionParserPipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobsComponent);
    component = fixture.componentInstance;
    component.companyJobSearchComponent = {} as any;
    component.companyJobSearchComponent.writeValue = () => {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show total company jobs', () => {
    component.totalCompanyJobsGridItems$ = of(123);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should fire the right actions when the grid state is changed', () => {
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    component.handleDataStateChange(dataStateChangeEvent);

    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, dataStateChangeEvent);
    const loadCompanyJobsAction = new fromCompanyJobsActions.LoadCompanyJobs();

    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });

  it('should fire the UpdateSearchTerm action when the search term is changed', () => {
    const searchTerm = 'changed';
    component.handleSearchBoxValueChanged(searchTerm);

    const searchTermUpdatedAction = new fromCompanyJobsActions.UpdateSearchTerm(searchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(searchTermUpdatedAction);
  });

  it('should not fire the LoadCompanyJobs action when the search term is one character', () => {
    const searchTerm = 'x';
    component.handleSearchBoxValueChanged(searchTerm);

    const loadCompanyJobsAction = new fromCompanyJobsActions.LoadCompanyJobs();

    expect(store.dispatch).not.toHaveBeenCalledWith(loadCompanyJobsAction);
  });

  it('should fire the updateSearchTermAction followed by loadExchangeJobsAction when the search term is more than one character', () => {
    const searchTerm = 'xx';
    component.handleSearchBoxValueChanged(searchTerm);

    const searchTermUpdatedAction = new fromCompanyJobsActions.UpdateSearchTerm(searchTerm);
    const loadCompanyJobsAction = new fromCompanyJobsActions.LoadCompanyJobs();

    expect(store.dispatch).toHaveBeenCalledWith(searchTermUpdatedAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });
});
