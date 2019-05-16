import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedChangesWarningComponent } from './unsaved-changes-warning.component';

describe('UnsavedChangesWarningComponent', () => {
  let component: UnsavedChangesWarningComponent;
  let fixture: ComponentFixture<UnsavedChangesWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsavedChangesWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsavedChangesWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when isVisible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should render when isVisible is true', () => {
    component.isVisible = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should emit on leave clicked', () => {
    // arrange
    spyOn(component.leaveClick, 'emit');
    spyOn(component.cancelClick, 'emit');
    component.isVisible = true;
    fixture.detectChanges();

    // act
    const leaveButton = fixture.debugElement.nativeElement.querySelector('button.btn-primary');
    leaveButton.click();

    // assert
    expect(component.leaveClick.emit).toHaveBeenCalled();
    expect(component.cancelClick.emit).not.toHaveBeenCalled();
  });

  it('should emit on cancel clicked', () => {
    // arrange
    spyOn(component.leaveClick, 'emit');
    spyOn(component.cancelClick, 'emit');
    component.isVisible = true;
    fixture.detectChanges();

    // act
    const cancelButton = fixture.debugElement.nativeElement.querySelector('button.btn-secondary');
    cancelButton.click();

    // assert
    expect(component.cancelClick.emit).toHaveBeenCalled();
    expect(component.leaveClick.emit).not.toHaveBeenCalled();
  });
});
