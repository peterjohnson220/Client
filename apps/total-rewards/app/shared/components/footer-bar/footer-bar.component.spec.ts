import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBarComponent } from './footer-bar.component';

describe('FooterBarComponent', () => {
  let component: FooterBarComponent;
  let fixture: ComponentFixture<FooterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterBarComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the primary button is clicked', () => {
    // arrange
    spyOn(component.primaryButtonClick, 'emit');

    // act
    const primaryButton = fixture.debugElement.nativeElement.querySelector('button.btn-trs-primary');
    primaryButton.click();

    // assert
    expect(component.primaryButtonClick.emit).toHaveBeenCalledTimes(1);
  });

  it('should hide the secondary button when it`s text is falsy', () => {
    // arrange
    component.secondaryButtonText = '';

    // act
    const secondaryButton = fixture.debugElement.nativeElement.querySelector('a.secondary');

    // assert
    expect(secondaryButton).toBeFalsy();
  });

  it('should show the secondary button when it`s text is supplied', () => {
    // arrange
    component.secondaryButtonText = 'Back to Canvas';
    fixture.detectChanges();

    // act
    const secondaryButton = fixture.debugElement.nativeElement.querySelector('a.secondary');

    // assert
    expect(secondaryButton).toBeTruthy();
    expect(secondaryButton.textContent).toContain('Back to Canvas');
  });
});
