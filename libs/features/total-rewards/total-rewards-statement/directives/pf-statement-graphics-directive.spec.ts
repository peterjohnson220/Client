import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StatementGraphicsDirective } from './pf-statement-graphics-directive';

// declare a test component so we have a home for the directive with mode set to 0/edit
@Component({
  selector: 'pf-test-mode-classifier-component',
  template: `
    <div class="bg-primary" pfStatementGraphicsDirective [colors]="['red', 'green', 'blue']" [colorRank]="1"></div>
    <div class="color-tertiary" pfStatementGraphicsDirective [colors]="['red', 'green', 'blue']" [colorRank]="3" [styleAttrToColor]="'color'"></div>
    <div class="undefined" pfStatementGraphicsDirective [colors]="['red', 'green', 'blue']" [colorRank]="0" [styleAttrToColor]="'color'"></div>
    <div class="disabled" pfStatementGraphicsDirective [colors]="['red', 'green', 'blue']" [colorRank]="1" [styleAttrToColor]="'color'" [enabled]="false"></div>
  `
})
class TestStatementGraphicsComponent {}

describe('TrsSummaryControlComponent', () => {
  let component: TestStatementGraphicsComponent;
  let fixture: ComponentFixture<TestStatementGraphicsComponent>;

  let directiveInstance: StatementGraphicsDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestStatementGraphicsComponent,
        StatementGraphicsDirective
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStatementGraphicsComponent);
    component = fixture.componentInstance;

    // get handles to the directive's dom node, and the directive itself
    const directiveNode = fixture.debugElement.query(By.directive(StatementGraphicsDirective));
    directiveInstance = directiveNode.injector.get(StatementGraphicsDirective);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set background-color as primary', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = fixture.debugElement.nativeElement.querySelector('.bg-primary');
    expect(domNode.style['background-color']).toBe('red');
  });

  it('should set color as tertiary', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = fixture.debugElement.nativeElement.querySelector('.color-tertiary');
    expect(domNode.style['color']).toBe('blue');
  });

  it('should not set color when color rank is enum `Undefined`', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = fixture.debugElement.nativeElement.querySelector('.undefined');
    expect(domNode.style['color']).toBeFalsy();
  });

  it('should not set colors when explicitly disabled', () => {
    // act
    fixture.detectChanges();

    // assert
    const domNode = fixture.debugElement.nativeElement.querySelector('.disabled');
    expect(domNode.style['color']).toBeFalsy();
  });
});
