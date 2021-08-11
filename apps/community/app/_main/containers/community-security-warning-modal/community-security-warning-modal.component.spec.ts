import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import * as fromRootState from 'libs/state/state';
import { CommunitySecurityWarningModalComponent } from './community-security-warning-modal.component';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';
import { DownloadTypeEnum } from '../../models/download-type.enum';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../actions/community-file-download-security-warning.actions';

describe('CommunitySecurityWarningModalComponent', () => {
  let instance: CommunitySecurityWarningModalComponent;
  let fixture: ComponentFixture<CommunitySecurityWarningModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService, provideMockStore({})],
      declarations: [
        CommunitySecurityWarningModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunitySecurityWarningModalComponent);
    instance = fixture.componentInstance;
  }));

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
});
