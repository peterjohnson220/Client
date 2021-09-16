import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import * as fromAddGradeModalActions from '../../actions/add-grade-modal.actions';
import * as fromAddGradeModalReducer from '../../reducers';

import { AddGradeModalComponent } from './add-grade-modal.component';


describe('Structures - Grade Based Range - Add Data Modal Component', () => {
  let instance: AddGradeModalComponent;
  let fixture: ComponentFixture<AddGradeModalComponent>;
  let store: Store<fromAddGradeModalReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromAddGradeModalReducer.reducers),
          comphub_crowd_sourced: combineReducers(fromAddGradeModalReducer.reducers)
        }),
        DropDownsModule,
      ],
      declarations: [AddGradeModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AddGradeModalComponent);
    instance = fixture.componentInstance;

    instance.rangeGroupId = 100
    instance.buildForm();
    instance.newGradeForm.setValue({
      GradeName: "TestGrade"
    });

    store = TestBed.inject(Store);
  });

  it('should dispatch AddGrade action', () => {
    jest.spyOn(store, 'dispatch');

    const request = {
      rangeGroupId: instance.rangeGroupId,
      gradeName: instance.newGradeForm.get('GradeName').value
    }

    const expectedAction = new fromAddGradeModalActions.AddGrade(request);
    instance.handleModalSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  })
});