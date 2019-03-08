import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import * as fromJobAssociationReducers from '../../reducers';
import * as jobAssociationModalActions from '../../actions/job-association-modal.actions';
import { JobAssociationModalComponent } from './job-association-modal.component';
import {ExchangeJobAssociation, generateMockExchangeJobAssociation} from '../../models';

describe('JobAssociationModalComponent', () => {
  let component: JobAssociationModalComponent;
  let fixture: ComponentFixture<JobAssociationModalComponent>;
  let store: Store<fromJobAssociationReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_association: combineReducers(fromJobAssociationReducers.reducers)
        }),
      ],
      declarations: [ JobAssociationModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAssociationModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return isSaveButtonEnabled as false if no exchange job associations exist', () => {
    component.exchangeJobAssociations$ = of([]);
    fixture.detectChanges();
    expect(component.isSaveButtonEnabled()).toEqual(false);
  });
});
