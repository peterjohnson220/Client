import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CommunityDashboardPageComponent } from './community-dashboard.page';
import { Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import {BrowserDetectionService} from 'libs/core/services';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromCommunityPostActions from '../../../actions/community-post.actions';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../../actions/community-file-download-security-warning.actions';
import * as fromCommunityPollResponseActions from '../../../actions/community-poll-response.actions';
import { DownloadTypeEnum } from '../../../models/download-type.enum';

describe('CommunityDashboardPageComponent', () => {
  let fixture: ComponentFixture<CommunityDashboardPageComponent>;
  let instance: CommunityDashboardPageComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [BrowserDetectionService, SettingsService, {
        provide: Router,
        useValue: { navigate: jest.fn() },
      }],
      declarations: [
        CommunityDashboardPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    setupMutationObserverMock(global);

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityDashboardPageComponent);
    instance = fixture.componentInstance;
  }));

  it('should dispatch GettingBackToTopCommunityPosts when calling backToTop', () => {
    const action = new fromCommunityPostActions.GettingBackToTopCommunityPosts();
    instance.backToTop();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch ExportingCommunityUserPollResponses when handleSecurityWarningConfirmed is called with CommunityUserPollExport DownloadType', () => {
    const exportPollAction = new fromCommunityPollResponseActions.ExportingCommunityUserPollResponses('MockDownloadId');
    instance.fileDownloadSecurityWarningModal_DownloadId = 'MockDownloadId';
    instance.fileDownloadSecurityWarningModal_DownloadType = DownloadTypeEnum.CommunityUserPollExport;

    instance.handleSecurityWarningConfirmed(true);

    expect(store.dispatch).toHaveBeenCalledWith(exportPollAction);
  });

  it('should set window.location.href to correct url when handleSecurityWarningConfirmed is called with CommunityAttachment DownloadType', () => {
    const url = 'MockDownloadId';
    instance.fileDownloadSecurityWarningModal_DownloadId = url;
    instance.fileDownloadSecurityWarningModal_DownloadType = DownloadTypeEnum.CommunityAttachment;

    instance.handleSecurityWarningConfirmed(true);

    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    expect(window.location.href).toEqual(url);
  });

  it('should dispatch CloseCommunityFileDownloadSecurityWarningModal when calling handleSecurityWarningConfirmed', () => {
    const action = new fromCommunityFileDownloadSecurityWarningActions.CloseCommunityFileDownloadSecurityWarningModal();
    instance.handleSecurityWarningConfirmed(true);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch CloseCommunityFileDownloadSecurityWarningModal when calling handleSecurityWarningCancelled', () => {
    const action = new fromCommunityFileDownloadSecurityWarningActions.CloseCommunityFileDownloadSecurityWarningModal();
    instance.handleSecurityWarningCancelled();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should show community dashboard page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  function setupMutationObserverMock(data) {
    data.MutationObserver = class {
      constructor(callback) {}
      disconnect() {}
      observe(element, initObject) {}
    };
  }
});
