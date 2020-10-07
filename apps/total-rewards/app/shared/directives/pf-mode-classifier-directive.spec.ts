import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModeClassifierDirective } from './pf-mode-classifier-directive';

// declare a test component so we have a home for the directive with mode set to 0/edit
@Component({
  selector: 'pf-test-mode-classifier-component',
  template: `
    <div class="unrelated-class preview-mode" pfModeClassifierDirective [mode]="0"></div>
  `
})
class TestModeClassifierComponent {}

describe('TrsSummaryControlComponent', () => {
  let component: TestModeClassifierComponent;
  let fixture: ComponentFixture<TestModeClassifierComponent>;

  let directiveInstance: ModeClassifierDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestModeClassifierComponent,
        ModeClassifierDirective
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestModeClassifierComponent);
    component = fixture.componentInstance;

    // get handles to the directive's dom node, and the directive itself
    const directiveNode = fixture.debugElement.query(By.directive(ModeClassifierDirective));
    directiveInstance = directiveNode.injector.get(ModeClassifierDirective);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should maintain existing classes', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = directiveInstance.elementRef.nativeElement as HTMLElement;
    expect(domNode.classList.contains('unrelated-class')).toBeTruthy();
  });

  it('should add edit-mode class when in edit mode', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = directiveInstance.elementRef.nativeElement as HTMLElement;
    expect(domNode.classList.contains(directiveInstance.editClass)).toBeTruthy();
  });

  it('should remove previous mode class', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = directiveInstance.elementRef.nativeElement as HTMLElement;
    expect(domNode.classList.contains(directiveInstance.previewClass)).toBeFalsy();
  });
});
