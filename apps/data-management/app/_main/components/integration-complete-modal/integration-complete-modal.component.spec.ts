import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationCompleteModalComponent } from './integration-complete-modal.component';

describe('IntegrationCompleteModalComponent', () => {
  let component: IntegrationCompleteModalComponent;
  let fixture: ComponentFixture<IntegrationCompleteModalComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationCompleteModalComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationCompleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on OK clicked', () => {
    spyOn(component.dismissed, 'emit');

    component.onOk();

    expect(component.dismissed.emit).toHaveBeenCalledTimes(1);
  });
});
