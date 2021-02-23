import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMappingCardComponent } from './field-mappings-card.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

describe('Data Management - Main - Field Mappings Card Component', () => {
  let instance: FieldMappingCardComponent;
  let fixture: ComponentFixture<FieldMappingCardComponent>;

  @Pipe({name: 'orgDataEntityTypeToDisplayName'})
  class MockPipe implements PipeTransform {
      transform = (value: any) => value;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbNavModule
      ],
      declarations: [
        FieldMappingCardComponent,
        MockPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldMappingCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(instance).toBeTruthy();
  });
});
