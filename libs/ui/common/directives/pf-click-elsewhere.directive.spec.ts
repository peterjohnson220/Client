import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClickElsewhereDirective } from './pf-click-elsewhere.directive';

// declare a test component so we have a home for the directive
@Component({
  selector: 'pf-test-click-elsewhere-component',
  template: `
    <div class="parent">
      <div class="sibling"></div>
      <div class="sibling ignore-click-elsewhere"></div>
      <div pfClickElsewhere>
        <div class="child"><div>
      </div>
    </div>
  `
})
class TestClickElsewhereComponent {}

describe('TrsSummaryControlComponent', () => {
  let component: TestClickElsewhereComponent;
  let fixture: ComponentFixture<TestClickElsewhereComponent>;

  let directiveInstance: ClickElsewhereDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestClickElsewhereComponent,
        ClickElsewhereDirective
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestClickElsewhereComponent);
    component = fixture.componentInstance;

    // get handles to the directive's dom node, and the directive itself
    const directiveNode = fixture.debugElement.query(By.directive(ClickElsewhereDirective));
    directiveInstance = directiveNode.injector.get(ClickElsewhereDirective);

    spyOn(directiveInstance.clickElsewhere, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when a sibling is clicked', () => {
    // act
    const sibling = fixture.debugElement.nativeElement.querySelector('.sibling');
    sibling.click();

    // assert
    expect(directiveInstance.clickElsewhere.emit).toHaveBeenCalled();
  });

  it('should not emit when a whitelisted sibling is clicked', () => {
    // arrange
    directiveInstance.whitelist = ['ignore-click-elsewhere'];

    // act
    const whitelistedSibling = fixture.debugElement.nativeElement.querySelector('.sibling.ignore-click-elsewhere');
    whitelistedSibling.click();

    // assert
    expect(directiveInstance.clickElsewhere.emit).not.toHaveBeenCalled();
  });

  it('should emit when a parent is clicked', () => {
    // act
    const parent = fixture.debugElement.nativeElement.querySelector('.parent');
    parent.click();

    // assert
    expect(directiveInstance.clickElsewhere.emit).toHaveBeenCalled();
  });

  it('should not emit when a child is clicked', () => {
    // act
    const child = fixture.debugElement.nativeElement.querySelector('.child');
    child.click();

    // assert
    expect(directiveInstance.clickElsewhere.emit).not.toHaveBeenCalled();
  });
});
