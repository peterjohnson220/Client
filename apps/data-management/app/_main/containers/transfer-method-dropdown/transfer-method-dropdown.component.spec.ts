import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMethodDropdownComponent } from './transfer-method-dropdown.component';

describe('Data Management - Main - Transfer Method Dropdown', () => {
  let instance: TransferMethodDropdownComponent;
  let fixture: ComponentFixture<TransferMethodDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        TransferMethodDropdownComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferMethodDropdownComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Should emit an event on change on transfermethod change event', () => {
    spyOn(instance.transferMethodSelected, 'emit');
    const event = {
      target: {
        value: 1
      }
    };

    instance.transferMethodChanged(event);

    expect(instance.transferMethodSelected.emit).toHaveBeenCalledTimes(1);
  });
});
