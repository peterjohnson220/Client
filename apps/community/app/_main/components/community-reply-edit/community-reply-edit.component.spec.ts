import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { CommunityReplyEditComponent } from './community-reply-edit.component';
import { generateMockCommunityReply } from 'libs/models';

describe('CommunityReplyEditComponent', () => {
  let fixture: ComponentFixture<CommunityReplyEditComponent>;
  let instance: CommunityReplyEditComponent;
  let store: Store<fromRootState.State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
      ],
      declarations: [ CommunityReplyEditComponent ],
      providers: [ FormBuilder ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityReplyEditComponent);
    instance = fixture.componentInstance;
    instance.reply = generateMockCommunityReply();
  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
