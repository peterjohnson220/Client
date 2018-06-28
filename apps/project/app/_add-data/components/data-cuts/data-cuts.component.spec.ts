import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCutsComponent } from './data-cuts.component';

describe('DataCutsComponent', () => {
  let component: DataCutsComponent;
  let fixture: ComponentFixture<DataCutsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCutsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
