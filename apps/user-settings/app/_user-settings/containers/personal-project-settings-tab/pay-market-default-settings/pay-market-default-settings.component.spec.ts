import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMarketDefaultSettingsComponent } from './pay-market-default-settings.component';

describe('PayMarketDefaultSettingsComponent', () => {
  let component: PayMarketDefaultSettingsComponent;
  let fixture: ComponentFixture<PayMarketDefaultSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayMarketDefaultSettingsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayMarketDefaultSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
