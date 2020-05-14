import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityAttachmentEditComponent } from './community-attachment-edit.component';
import { TruncateAfterPipe } from 'libs/core';

describe('CommunityAttachmentEditComponent', () => {
  let fixture: ComponentFixture<CommunityAttachmentEditComponent>;
  let instance: CommunityAttachmentEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunityAttachmentEditComponent,
        TruncateAfterPipe
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityAttachmentEditComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

});
