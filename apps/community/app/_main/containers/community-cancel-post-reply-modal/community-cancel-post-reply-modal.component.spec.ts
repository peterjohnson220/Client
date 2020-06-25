import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityAttachmentWarningReducer from '../../reducers';
import { CommunityCancelPostReplyModalComponent } from './community-cancel-post-reply-modal.component';
import { SettingsService } from 'libs/state/app-context/services';

describe('CommunityCancelPostReplyModalComponent', () => {
  let component: CommunityCancelPostReplyModalComponent;
  let fixture: ComponentFixture<CommunityCancelPostReplyModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityAttachment: combineReducers(fromCommunityAttachmentWarningReducer.reducers)
        })
      ],
      declarations: [ CommunityCancelPostReplyModalComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SettingsService]
    })
    .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCancelPostReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
