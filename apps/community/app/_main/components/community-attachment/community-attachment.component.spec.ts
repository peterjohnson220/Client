import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityAttachmentComponent } from './community-attachment.component';
import { TruncateAfterPipe } from 'libs/core';

describe('CommunityAttachmentComponent', () => {
  let fixture: ComponentFixture<CommunityAttachmentComponent>;
  let instance: CommunityAttachmentComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunityAttachmentComponent,
        TruncateAfterPipe
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityAttachmentComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

});
