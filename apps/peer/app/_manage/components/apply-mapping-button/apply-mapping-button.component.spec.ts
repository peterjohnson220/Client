import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ApplyMappingButtonComponent } from './apply-mapping-button.component';

describe('Peer - Apply Mapping Button', () => {
  let fixture: ComponentFixture<ApplyMappingButtonComponent>;
  let instance: ApplyMappingButtonComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApplyMappingButtonComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ApplyMappingButtonComponent);
    instance = fixture.componentInstance;
  });

  it('should show an apply mapping button, when using the defaults', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an apply mapping button with a .btn-primary class, when it is the selected mapping', () => {
    instance.selectedMapping = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show an applying mapping... button with a loading indicator,
      when it is the selected mapping and we are applying the mapping`, () => {
    instance.selectedMapping = true;
    instance.applyingMapping = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a disabled Mapped button, when mapped is true', () => {
    instance.mapped = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message under a Retry button, when an error has occurred and it is the selected mapping', () => {
    instance.applyingMappingError = true;
    instance.selectedMapping = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit an applyMapping event, when clicking a apply mapping button', () => {
    fixture.detectChanges();

    spyOn(instance.applyMapping, 'emit');

    const applyMappingBtn = fixture.debugElement.query(By.css('.associate'));
    applyMappingBtn.triggerEventHandler('click', null);

    expect(instance.applyMapping.emit).toHaveBeenCalled();
  });

});
