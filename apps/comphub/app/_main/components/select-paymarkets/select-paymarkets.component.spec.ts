import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymarketsComponent } from './select-paymarkets.component';

describe('Comphub - Main - Select Paymarkets', () => {
  let instance: SelectPaymarketsComponent;
  let fixture: ComponentFixture<SelectPaymarketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPaymarketsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SelectPaymarketsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit a paymarketChecked event when paymarket toggled', () => {
    spyOn(instance.paymarketChecked, 'emit');

    instance.togglePaymarket(123);

    expect(instance.paymarketChecked.emit).toHaveBeenCalled();
  });

});
