import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordsFoundCallToActionComponent } from './no-records-found-call-to-action.component';

describe('NoRecordsFoundCallToActionComponent', () => {
  let component: NoRecordsFoundCallToActionComponent;
  let fixture: ComponentFixture<NoRecordsFoundCallToActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoRecordsFoundCallToActionComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRecordsFoundCallToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the link is clicked', () => {
    // arrange
    component.linkText = 'create a new statement';
    spyOn(component.callToActionClick, 'emit');
    fixture.detectChanges();

    // act
    const callToActionLink = fixture.debugElement.nativeElement.querySelector('a.call-to-action');
    callToActionLink.click();

    // assert
    expect(component.callToActionClick.emit).toHaveBeenCalled();
  });

  it('should hide the link when no linkText is provided', () => {
    // arrange
    component.linkText = '';

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('a.call-to-action')).toBeFalsy();
  });

  it('should show the link when linkText is provided', () => {
    // arrange
    component.linkText = 'create a new statement';

    // act
    fixture.detectChanges();

    // assert
    const anchor = fixture.debugElement.nativeElement.querySelector('a.call-to-action');
    expect(anchor).toBeTruthy();
    expect(anchor.textContent.trim()).toBe('create a new statement');
  });
});
