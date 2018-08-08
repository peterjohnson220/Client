import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { DataCutsComponent } from './data-cuts.component';
import { generateMockDataCut } from '../../models';
import * as fromAddDataReducer from '../../reducers';


describe('DataCutsComponent', () => {
  let component: DataCutsComponent;
  let fixture: ComponentFixture<DataCutsComponent>;
  let store: Store<fromAddDataReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [ DataCutsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.get(Store);

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

  it('should show the data cut in the proper currency', () => {
    component.currencyCode = 'CAD';
    component.dataCuts = [generateMockDataCut()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show selected if the data cut has been selected', () => {
    component.dataCuts = [generateMockDataCut()];
    component.dataCuts[0].TCC50th = null;
    component.dataCuts[0].Base50th = null;
    component.dataCuts[0].IsSelected = true;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
