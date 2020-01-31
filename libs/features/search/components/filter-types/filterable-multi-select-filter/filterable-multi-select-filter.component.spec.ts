import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableMultiSelectFilterComponent } from './filterable-multi-select-filter.component';

describe('FilterableMultiSelectFilterComponent', () => {
  let component: FilterableMultiSelectFilterComponent;
  let fixture: ComponentFixture<FilterableMultiSelectFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterableMultiSelectFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterableMultiSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
