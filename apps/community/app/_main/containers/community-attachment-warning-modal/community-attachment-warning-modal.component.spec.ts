import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityAttachmentWarningReducer from '../../reducers';
import { CommunityAttachmentWarningModalComponent } from './community-attachment-warning-modal.component';
import { SettingsService } from 'libs/state/app-context/services';

describe('CommunityAttachmentWarningModalComponent', () => {
  let component: CommunityAttachmentWarningModalComponent;
  let fixture: ComponentFixture<CommunityAttachmentWarningModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityAttachment: combineReducers(fromCommunityAttachmentWarningReducer.reducers)
        })
      ],
      declarations: [ CommunityAttachmentWarningModalComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SettingsService]
    })
    .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAttachmentWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
