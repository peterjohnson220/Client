import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ButtonIconComponent } from './button-icon.component';

describe('UI/Common/Content - Card', () => {
  let fixture: ComponentFixture<ButtonIconComponent>;
  let instance: ButtonIconComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ButtonIconComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ButtonIconComponent);
    instance = fixture.componentInstance;
  });

  it('should emit selected event when onIconSelected is clicked', () => {
    jest.spyOn(instance.selected, 'emit');

    instance.onIconSelected();

    expect(instance.selected.emit).toHaveBeenCalled();
  });
});
