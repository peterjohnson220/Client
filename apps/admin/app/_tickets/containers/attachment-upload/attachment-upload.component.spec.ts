import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import { SuccessEvent, FileState, SelectEvent } from '@progress/kendo-angular-upload';

import { GetFileExtensionCssClassPipe } from 'libs/core/pipes';
import { generateMockUserTicketsFile } from 'libs/models/payfactors-api/service/response';

import { GetFileValidationErrorMessagePipe, GetUploadProgressCssClassPipe } from '../../pipes';
import { AttachmentUploadComponent } from './attachment-upload.component';


describe('Admin - Tickets - Attachment Upload', () => {
  let instance: AttachmentUploadComponent;
  let fixture: ComponentFixture<AttachmentUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
          AttachmentUploadComponent,
          GetUploadProgressCssClassPipe,
          GetFileValidationErrorMessagePipe,
          GetFileExtensionCssClassPipe
        ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AttachmentUploadComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should emit an event on succesful upload', () => {
    spyOn(instance.addAttachments, 'emit');

    const mockSuccessEvent = new SuccessEvent(
        [
            {
                uid: '1111-1111-1111-1111',
                name: 'MockAttachmentDisplayName',
                state: FileState.Uploaded,
            }
        ], 'upload', new HttpResponse({
            body: {
                value: [generateMockUserTicketsFile()]
            }
        }));

    instance.uploadSuccessEventHandler(mockSuccessEvent);

    expect(instance.uploadedFiles.length).toBe(0);
    expect(instance.addAttachments.emit).toHaveBeenCalledTimes(1);
  });

  it('Select event should add to the list of uploaded files', () => {
    const mockSelectEvent = new SelectEvent(
        [
            {
                uid: '1111-1111-1111-1111',
                name: 'MockAttachmentDisplayName',
                state: FileState.Selected,
            }
        ]);
    instance.selectEventHandler(mockSelectEvent);

    expect(instance.uploadedFiles.length).toBe(1);
  });
  it('Remove click should remove the item from the uploaded files', () => {
    const mockFile = {
        uid: '1111-1111-1111-1111',
        name: 'MockAttachmentDisplayName',
        state: FileState.Failed,
        uploadProgress: 0
    };
    const mockSelectEvent = new SelectEvent(
        [
            mockFile
        ]);
    instance.selectEventHandler(mockSelectEvent);
    instance.removeFileClick(mockFile);

    expect(instance.uploadedFiles.length).toBe(0);
  });
});
