import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityAttachmentReducer from '../../reducers';
import { CommunityAttachmentModalComponent } from './community-attachment-modal.component';

describe('CommunityAttachmentModalComponent', () => {
  let component: CommunityAttachmentModalComponent;
  let fixture: ComponentFixture<CommunityAttachmentModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityAttachment: combineReducers(fromCommunityAttachmentReducer.reducers)
        })
      ],
      declarations: [ CommunityAttachmentModalComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAttachmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
