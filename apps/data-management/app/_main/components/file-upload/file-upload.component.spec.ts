import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate file extensions', () => {

    // everything is valid
    expect(component.validateFileExtension(new File([], 'anything.broken'))).toBe(true);

    // specific validation
    component.validFileExtensions = ['.csv', 'png'];
    expect(component.validateFileExtension(new File([], 'test.csv'))).toBe(true);
    expect(component.validateFileExtension(new File([], 'test.png'))).toBe(true);
    expect(component.validateFileExtension(new File([], 'test.jpg'))).toBe(false);
  });

  it('should validate file starts with', () => {
    // everything is valid
    expect(component.validateFileStartsWith(new File([], 'anything.broken'))).toBe(true);

    // specific validation
    component.validFileStartsWith = 'jobs';
    expect(component.validateFileStartsWith(new File([], 'jobs.test'))).toBe(true);
    expect(component.validateFileStartsWith(new File([], 'employee.test'))).toBe(false);
  });
});
