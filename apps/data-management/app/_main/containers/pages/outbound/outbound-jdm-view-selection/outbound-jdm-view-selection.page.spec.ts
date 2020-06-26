import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { OutboundJdmViewSelectionPageComponent } from './';

describe('Data Management - Main - Outbound Jdm View Selection Page', () => {
  let instance: OutboundJdmViewSelectionPageComponent;
  let fixture: ComponentFixture<OutboundJdmViewSelectionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OutboundJdmViewSelectionPageComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    fixture = TestBed.createComponent(OutboundJdmViewSelectionPageComponent);
    instance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
