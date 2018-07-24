import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCutsComponent } from './data-cuts.component';
import {generateMockDataCut} from '../../models';

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

  it('should display Title, Country and weight', () => {
    component.dataCuts = [generateMockDataCut()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should handle empty currency fields', () => {
    component.dataCuts = [generateMockDataCut()];
    component.dataCuts[0].TCC50th = null;
    component.dataCuts[0].Base50th = null;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
