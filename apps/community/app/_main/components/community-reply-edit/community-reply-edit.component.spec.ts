import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import 'rxjs/add/observable/of';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { CommunityReplyEditComponent } from './community-reply-edit.component';
import { generateMockCommunityReply } from 'libs/models';

describe('CommunityReplyEditComponent', () => {
  let fixture: ComponentFixture<CommunityReplyEditComponent>;
  let instance: CommunityReplyEditComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
      ],
      declarations: [ CommunityReplyEditComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityReplyEditComponent);
    instance = fixture.componentInstance;
    instance.reply = generateMockCommunityReply();
  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
