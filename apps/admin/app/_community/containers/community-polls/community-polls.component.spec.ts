import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { CommunityPollsComponent } from './community-polls.component';
import { CommunityPoll } from 'libs/models/community/community-poll.model';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

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
        ReactiveFormsModule
      ],
      declarations: [ CommunityPollsComponent ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPollsComponent);
    instance = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should dispatch an LoadingCommunityPolls on onInit', () => {
    const action = new fromCommunityPollActions.LoadingCommunityPolls();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an OpenAddCommunityPollModal action on openCommunityPollModal handler', () => {
    const action = new fromCommunityPollActions.OpenAddCommunityPollModal();

    instance.openCommunityPollModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
