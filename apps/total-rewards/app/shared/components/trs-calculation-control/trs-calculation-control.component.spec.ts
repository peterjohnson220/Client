import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsCalculationControlComponent } from './trs-calculation-control.component';

describe('TrsCalculationControlComponent', () => {
  let component: TrsCalculationControlComponent;
  let fixture: ComponentFixture<TrsCalculationControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsCalculationControlComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsCalculationControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.sectionTitlesStyles = {} as any;
    component.dataStyles = {} as any;
    component.calculationStyles = {} as any;
    component.controlData = {} as any;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the supplied data fields', () => {
    component.sectionTitlesStyles = {} as any;
    component.dataStyles = {} as any;
    component.calculationStyles = {} as any;
    component.controlData = { DataFields: ['first', 'second', 'third'] } as any;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.includes('first')).toBeTruthy();
    expect(fixture.nativeElement.textContent.includes('second')).toBeTruthy();
    expect(fixture.nativeElement.textContent.includes('third')).toBeTruthy();
  });

  it('should render the supplied title', () => {
    component.sectionTitlesStyles = {} as any;
    component.dataStyles = {} as any;
    component.calculationStyles = {} as any;
    component.controlData = { Title: 'test title' } as any;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.includes('test title')).toBeTruthy();
  });
});
