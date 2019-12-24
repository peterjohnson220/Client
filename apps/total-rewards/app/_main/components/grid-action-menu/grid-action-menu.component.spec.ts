import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionMenuComponent } from './grid-action-menu.component';

describe('GridActionMenuComponent', () => {
  let component: GridActionMenuComponent;
  let fixture: ComponentFixture<GridActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridActionMenuComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridActionMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should hide the menu options panel when the component is closed via omitting the `open` class', () => {
    component.isOpen = false;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show the menu options panel when the component is open via adding the `open` class', () => {
    component.isOpen = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should emit an open event when the ellipsis is clicked and the panel is closed', () => {
    spyOn(component.open, 'emit');
    spyOn(component.close, 'emit');

    component.statement = {} as any;
    component.isOpen = false;
    fixture.detectChanges();

    const ellipsisMenuLink = fixture.debugElement.nativeElement.querySelector('a.open-actions');
    ellipsisMenuLink.click();

    expect(component.open.emit).toHaveBeenCalledTimes(1);
    expect(component.close.emit).toHaveBeenCalledTimes(0);
  });

  it('should emit a close event when the ellipsis is clicked and the panel is closed', () => {
    spyOn(component.open, 'emit');
    spyOn(component.close, 'emit');

    component.statement = {} as any;
    component.isOpen = true;
    fixture.detectChanges();

    const ellipsisMenuLink = fixture.debugElement.nativeElement.querySelector('a.open-actions');
    ellipsisMenuLink.click();

    expect(component.open.emit).toHaveBeenCalledTimes(0);
    expect(component.close.emit).toHaveBeenCalledTimes(1);
  });
});
