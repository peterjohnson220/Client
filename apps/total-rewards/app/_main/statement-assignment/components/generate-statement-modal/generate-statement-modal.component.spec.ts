import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateStatementModalComponent } from './generate-statement-modal.component';

describe('GenerateStatementModalComponent', () => {
  let component: GenerateStatementModalComponent;
  let fixture: ComponentFixture<GenerateStatementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateStatementModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateStatementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the statement name in the modal message', () => {
    // arrange
    component.statement = { StatementName: 'Test Statement Name' } as any;

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('Test Statement Name')).toBeTruthy();
  });

  it('should show the expected number of employees in the modal message', () => {
    // arrange
    component.selectedCompanyEmployeeIds = [1, 2, 3];

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('3 employees')).toBeTruthy();
  });

  it('should hide the employee pluralization when 1 employee is selected', () => {
    // arrange
    component.selectedCompanyEmployeeIds = [3];

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('1 employee')).toBeTruthy();
  });
});
