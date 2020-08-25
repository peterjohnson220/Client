import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloadCardComponent } from './file-download-card.component';

describe('FileDownloadCardComponent', () => {
  let component: FileDownloadCardComponent;
  let fixture: ComponentFixture<FileDownloadCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileDownloadCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the card when the display name is falsy', () => {
    // arrange
    component.fileDisplayName = null;

    // act
    fixture.detectChanges();

    // assert
    const card = fixture.debugElement.nativeElement.querySelector('.card');
    expect(card).toBeFalsy();
  });

  it('should show the card when the display name is truthy', () => {
    // arrange
    component.fileDisplayName = 'fileDisplayName';

    // act
    fixture.detectChanges();

    // assert
    const card = fixture.debugElement.nativeElement.querySelector('.card');
    expect(card).toBeTruthy();
  });

  it('should render a link with the href set to the download path', () => {
    // arrange
    component.fileDisplayName = 'fileDisplayName';
    component.downloadPath = 'test/path/file.excel';

    // act
    fixture.detectChanges();

    // assert
    const anchor = fixture.debugElement.nativeElement.querySelector('a.file-name');
    expect(anchor.href).toContain('test/path/file.excel');
  });

  it('should show the created date in the expected format', () => {
    // arrange
    component.fileDisplayName = 'fileDisplayName';
    component.createdDateTime = new Date('6/19/2020');

    // act
    fixture.detectChanges();

    // assert
    const cardSubTitle = fixture.debugElement.nativeElement.querySelector('.card-subtitle');
    expect(cardSubTitle.textContent).toBe('June 19, 2020');
  });
});
