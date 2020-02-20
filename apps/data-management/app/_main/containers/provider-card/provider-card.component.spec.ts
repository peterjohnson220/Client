import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCardComponent } from './provider-card.component';
import { generateMockProvider } from '../../models';

describe('Data Management - Main - Provider Card', () => {
  let instance: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  const mockActiveProvider = generateMockProvider();
  const mockInactiveProvider = generateMockProvider();
  mockInactiveProvider.Active = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        ProviderCardComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ProviderCardComponent);
    instance = fixture.componentInstance;
  });

  it('Should emit event when active provider is clicked', () => {
    // arrange
    instance.provider = mockActiveProvider;
    fixture.detectChanges();
    spyOn(instance.providerSelected, 'emit');

    // act
    instance.selectProviderClick(null);

    // assert
    expect(instance.providerSelected.emit).toHaveBeenCalledTimes(1);
  });

  it('Should not emit event when inactive provider is clicked', () => {
    // arrange
    instance.provider = mockInactiveProvider;
    fixture.detectChanges();
    spyOn(instance.providerSelected, 'emit');

    // act
    instance.selectProviderClick(null);

    // assert
    expect(instance.providerSelected.emit).not.toBeCalled();
  });
});
