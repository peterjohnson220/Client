import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyPipe} from '@angular/common';

import { TrsCalculationControlComponent } from './trs-calculation-control.component';
import { CompensationFieldPipe } from '../../pipes/compensation-field-pipe';

describe('TrsCalculationControlComponent', () => {
  let component: TrsCalculationControlComponent;
  let fixture: ComponentFixture<TrsCalculationControlComponent>;
  let currencyPipe: CurrencyPipe;
  let compensationField: CompensationFieldPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsCalculationControlComponent, CompensationFieldPipe],
      providers: [
        {
          provide: CurrencyPipe,
          useValue: { transform: (x) => x }
        },
        {
          provide: CompensationFieldPipe,
          useValue: { transform: (x) => x }
        }
        ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsCalculationControlComponent);
    component = fixture.componentInstance;
    currencyPipe = TestBed.get(CurrencyPipe);
    compensationField = TestBed.get(CompensationFieldPipe);
  });

  it('should create', () => {
    component.controlData = {
      DataFields: []
    } as any;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the supplied data fields', () => {
    component.controlData = {
      DataFields: [
        {
          FieldInDatabase: 'first',
          Placeholder: 'First',
          Name: '',
          IsVisible: true
        },
        {
          FieldInDatabase: 'second',
          Placeholder: 'Second',
          Name: '',
          IsVisible: true
        },
        {
          FieldInDatabase: 'third',
          Placeholder: 'Third',
          Name: '',
          IsVisible: true
        } ]
    } as any;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the supplied title', () => {
    component.controlData = {
      Title: 'test title',
      DataFields: []
    } as any;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display the Add Field button if a field has been removed', () => {
    component.controlData = {
      DataFields: [
        {
          FieldInDatabase: 'first',
          Placeholder: 'First',
          Name: '',
          IsVisible: false
        }
      ]
    } as any;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
