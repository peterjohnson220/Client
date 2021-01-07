import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { QuillToolbarComponent } from './quill-toolbar.component';

describe('QuillToolbarComponent', () => {
  let component: QuillToolbarComponent;
  let fixture: ComponentFixture<QuillToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuillToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have active class if active', () => {
    // Arrange
    component.isToolbarActive = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('.active-toolbar'))).toBeTruthy();
  });

  it('should not have active class if not active', () => {
    // Arrange
    component.isToolbarActive = false;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('.active-toolbar'))).toBeFalsy();
  });

  it('should have id if provided', () => {
    // Arrange
    const toolbarId = 'quill-editor-toolbar-2345ver3498fv';
    component.toolbarId = toolbarId;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('#' + toolbarId))).toBeTruthy();
  });
});
