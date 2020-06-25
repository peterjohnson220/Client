import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

import { CommunityPollsComponent } from './community-polls.component';

describe('CommunityPollsComponent', () => {
  let component: CommunityPollsComponent;
  let fixture: ComponentFixture<CommunityPollsComponent>;
  let instance: CommunityPollsComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityAdminMain: combineReducers(fromCommunityPollReducer.reducers)
        }),
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ CommunityPollsComponent ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPollsComponent);
    instance = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture.detectChanges();
    fixture = TestBed.createComponent(CommunityPollsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should dispatch an LoadingCommunityPolls on onInit', () => {
    fixture.detectChanges();
    const action = new fromCommunityPollActions.LoadingCommunityPolls();
    instance.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an OpenCommunityPollModal action on openCommunityPollModal handler', () => {
    fixture.detectChanges();
    const action = new fromCommunityPollActions.OpenCommunityPollModal();
    instance.openCommunityPollModal();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
