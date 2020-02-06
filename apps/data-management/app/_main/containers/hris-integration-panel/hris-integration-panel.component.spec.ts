import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrisIntegrationPanelComponent } from './hris-integration-panel.component';

describe('HrisIntegrationPanelComponent', () => {
  let component: HrisIntegrationPanelComponent;
  let fixture: ComponentFixture<HrisIntegrationPanelComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ HrisIntegrationPanelComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrisIntegrationPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
