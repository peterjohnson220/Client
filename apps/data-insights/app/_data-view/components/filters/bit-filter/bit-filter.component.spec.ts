import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BitFilterComponent } from './bit-filter.component';

describe('Data Insights - Bit Filter Component', () => {
  let instance: BitFilterComponent;
  let fixture: ComponentFixture<BitFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BitFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(BitFilterComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit selectedValueChanged when handling selected value changed', () => {
    spyOn(instance.selectedValueChanged, 'emit');

    instance.handleSelectedValueChanged('false');

    expect(instance.selectedValueChanged.emit).toHaveBeenCalledWith(['false']);
  });
});
