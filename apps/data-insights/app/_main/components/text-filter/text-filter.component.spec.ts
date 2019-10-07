import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { TextFilterComponent } from './text-filter.component';

describe('Data Insights - Text Filter Card Component', () => {
  let instance: TextFilterComponent;
  let fixture: ComponentFixture<TextFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TextFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ DropDownsModule ]
    });

    fixture = TestBed.createComponent(TextFilterComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should not emit any value when the text is blank', () => {
    spyOn(instance.valueChanged, 'emit');

    instance.value = '';
    instance.handleTextChanged();

    expect(instance.valueChanged.emit).toHaveBeenCalledWith([]);

  });

  it('should emit the textbox value when it is populated', () => {
    spyOn(instance.valueChanged, 'emit');

    instance.value = 'text here';
    instance.handleTextChanged();

    expect(instance.valueChanged.emit).toHaveBeenCalledWith(['text here']);

  });


});
