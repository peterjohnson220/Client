import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as fromRootState from 'libs/state/state';

import { generateMockOutboundProvider } from '../../../../models';
import { OutboundProviderSelectionPageComponent } from '.';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';

describe('Data Management - Main - Outbound Provider Card', () => {
  let instance: OutboundProviderSelectionPageComponent;
  let fixture: ComponentFixture<OutboundProviderSelectionPageComponent>;

  const mockActiveProvider = generateMockOutboundProvider();
  const mockInactiveProvider = generateMockOutboundProvider();
  mockInactiveProvider.Active = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        OutboundProviderSelectionPageComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(OutboundProviderSelectionPageComponent);
    instance = fixture.componentInstance;
  });

  it('Should emit event when active provider is clicked', () => {
    // arrange
    instance.provider = mockActiveProvider;
    fixture.detectChanges();
    spyOn(instance.outboundProviderSelected, 'emit');

    // act
    instance.selectProviderClick(null);

    // assert
    expect(instance.outboundProviderSelected.emit).toHaveBeenCalledTimes(1);
  });

  it('Should not emit event when inactive provider is clicked', () => {
    // arrange
    instance.provider = mockInactiveProvider;
    fixture.detectChanges();
    spyOn(instance.outboundProviderSelected, 'emit');

    // act
    instance.selectProviderClick(null);

    // assert
    expect(instance.outboundProviderSelected.emit).not.toBeCalled();
  });
});
