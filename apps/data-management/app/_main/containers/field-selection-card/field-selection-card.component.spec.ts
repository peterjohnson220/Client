import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSelectionCardComponent } from './field-selection-card.component';

describe('Data Management - Main - Field Selection Card Component', () => {
  let component: FieldSelectionCardComponent;
  let fixture: ComponentFixture<FieldSelectionCardComponent>;

  @Pipe({name: 'orgDataEntityTypeToDisplayName'})
  class MockPipe implements PipeTransform {
    transform = (value: any) => value;
  }
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        FieldSelectionCardComponent,
        MockPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldSelectionCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
