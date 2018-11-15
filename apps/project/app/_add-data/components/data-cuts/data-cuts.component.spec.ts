import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { DataCutsComponent } from './data-cuts.component';
import { generateMockDataCut, generateMockSurveyJobResult, SurveyDataCut } from '../../models';
import * as fromAddDataReducer from '../../reducers';

describe('DataCutsComponent', () => {
  let instance: DataCutsComponent;
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
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);

    fixture = TestBed.createComponent(DataCutsComponent);
    instance = fixture.componentInstance;

    // Set up
    instance.job = generateMockSurveyJobResult();
  });

  it('should display Scope, Country and Weight', () => {
    instance.dataCuts = [generateMockDataCut()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should handle empty currency fields', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].TCC50th = null;
    instance.dataCuts[0].Base50th = null;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show selected if the data cut has been selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].TCC50th = null;
    instance.dataCuts[0].Base50th = null;
    instance.dataCuts[0].IsSelected = true;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit matchesMouseEnter event when mouse enter Matches field', () => {
    const dataCut: SurveyDataCut = generateMockDataCut();
    const mouseEnterEvent: MouseEvent = new MouseEvent('mouseenter');

    spyOn(instance.matchesMouseEnter, 'emit');
    instance.handleMatchesMouseEnter(mouseEnterEvent, dataCut);

    expect(instance.matchesMouseEnter.emit).toHaveBeenCalled();
  });

  it('should emit matchesMouseLeave event when mouse leave Matches field', fakeAsync(() => {
    const mouseLeaveEvent: MouseEvent = new MouseEvent('mouseleave');

    spyOn(instance.matchesMouseLeave, 'emit');
    instance.handleMatchesMouseLeave(mouseLeaveEvent);
    tick(100);

    expect(instance.matchesMouseLeave.emit).toHaveBeenCalled();
  }));

  it('should show a message when there is no data cuts', () => {
    instance.dataCuts = [];
    instance.currencyCode = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should have a draggable class if cuts draggable and cut is selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].IsSelected = true;
    instance.cutsDraggable = true;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not have a draggable class if cuts draggable and cut is not selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].IsSelected = false;
    instance.cutsDraggable = true;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not have a draggable class if cuts not draggable and cut is selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].IsSelected = true;
    instance.cutsDraggable = false;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should pluralize drag cuts message if multiple data cuts selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].IsSelected = true;
    instance.cutsDraggable = false;
    instance.numberCutsSelected = 2;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display singular drag cuts message if single cut selected', () => {
    instance.dataCuts = [generateMockDataCut()];
    instance.dataCuts[0].IsSelected = true;
    instance.cutsDraggable = false;
    instance.numberCutsSelected = 1;


    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
