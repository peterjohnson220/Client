import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCardComponent } from './provider-card.component';
import { generateMockProvider } from '../../models';

describe('Data Management - Main - Provider Card', () => {
  let instance: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  const mockProvider = generateMockProvider();

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

    instance.provider = mockProvider;
    fixture.detectChanges();
  });

  it('Should emit event when provider is clicked', () => {
    spyOn(instance.providerSelected, 'emit');

    instance.selectProviderClick(null);

    expect(instance.providerSelected.emit).toHaveBeenCalledTimes(1);
  });
});
