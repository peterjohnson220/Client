import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderListComponent } from './provider-list.component';

describe('ProviderListComponent', () => {
  let instance: ProviderListComponent;
  let fixture: ComponentFixture<ProviderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderListComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(ProviderListComponent);
    instance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('Should emit event when provider is clicked', () => {
    spyOn(instance.providerSelected, 'emit');
    instance.setSelectedProvider(null);
    expect(instance.providerSelected.emit).toHaveBeenCalledTimes(1);
  });
});
