import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncateAfterPipe } from 'libs/core';
import { generateMockCommunityAttachment } from 'libs/models/community';
import * as fromRootState from 'libs/state/state';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../actions/community-file-download-security-warning.actions';
import { CommunityAttachmentComponent } from './community-attachment.component';

describe('CommunityAttachmentComponent', () => {
  let fixture: ComponentFixture<CommunityAttachmentComponent>;
  let instance: CommunityAttachmentComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        CommunityAttachmentComponent,
        TruncateAfterPipe
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityAttachmentComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  // tslint:disable-next-line:max-line-length
  it('onAttachmentClicked() should emit onAttachmentClickedEvent when community attachments are not disabled and attachment warning modal is not hidden', () => {
    instance.attachment = generateMockCommunityAttachment();
    instance.disableCommunityAttachments = false;
    instance.hideAttachmentWarning = false;

    spyOn(instance.onAttachmentClickedEvent, 'emit');
    instance.onAttachmentClicked();
    fixture.detectChanges();

    expect(instance.onAttachmentClickedEvent.emit).toHaveBeenCalledTimes(1);
  });

  // tslint:disable-next-line:max-line-length
  it('onAttachmentClicked() should dispatch OpenCommunityFileDownloadSecurityWarningModal when community attachments are not disabled, attachment warning modal is hidden and fileDownloadSecurityWarning is enabled', () => {
    const action = new fromCommunityFileDownloadSecurityWarningActions.OpenCommunityFileDownloadSecurityWarningModal
    ({downloadId: '/odata/CloudFiles.DownloadCommunityAttachment?FileName=MockName.pdf', downloadType: 'CommunityAttachment'});

    instance.attachment = generateMockCommunityAttachment();
    instance.disableCommunityAttachments = false;
    instance.hideAttachmentWarning = true;
    instance.showFileDownloadSecurityWarning = true;

    instance.onAttachmentClicked();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
