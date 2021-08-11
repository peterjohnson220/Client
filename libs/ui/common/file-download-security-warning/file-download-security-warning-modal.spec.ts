import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { FileDownloadSecurityWarningModalComponent } from './file-download-security-warning-modal.component';

describe('FileDownloadSecurityWarningModalComponent', () => {
  let fixture: ComponentFixture<FileDownloadSecurityWarningModalComponent>;
  let instance: FileDownloadSecurityWarningModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule
      ],
      declarations: [
        FileDownloadSecurityWarningModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FileDownloadSecurityWarningModalComponent);
    instance = fixture.componentInstance;
  });

  it('should emit an securityWarningConfirmed event, when handleSecurityWarningConfirmed is triggered', () => {
    jest.spyOn(instance.securityWarningConfirmed, 'emit');

    fixture.detectChanges();

    instance.open();
    instance.handleSecurityWarningConfirmed();

    expect(instance.securityWarningConfirmed.emit).toHaveBeenCalled();
  });
});
