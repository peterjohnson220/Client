import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import * as fromJobAssociationReducers from '../../reducers';
import * as fromJobAssociationActions from '../../actions/job-association-modal.actions';
import { JobAssociationModalComponent } from './job-association-modal.component';
import { generateMockExchangeJobAssociation } from '../../models';

describe('JobAssociationModalComponent', () => {
  let component: JobAssociationModalComponent;
  let fixture: ComponentFixture<JobAssociationModalComponent>;
  let store: Store<fromJobAssociationReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_association: combineReducers(fromJobAssociationReducers.reducers)
        }),
      ],
      declarations: [ JobAssociationModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAssociationModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return isSaveButtonEnabled as true if there are job associations and no removals', () => {
    fixture.detectChanges();
    component.exchangeJobAssociations = [generateMockExchangeJobAssociation()];
    component.exchangeJobAssociationsToRemove = [];
    fixture.detectChanges();

    expect(component.isSaveButtonEnabled()).toEqual(true);
  });

  it('should return isSaveButtonEnabled as true if there are removals and no associations', () => {
    fixture.detectChanges();
    component.exchangeJobAssociations = [];
    component.exchangeJobAssociationsToRemove = [123456];
    fixture.detectChanges();

    expect(component.isSaveButtonEnabled()).toEqual(true);
  });

  it('should disable the save button if there are no saveable changes', () => {
    fixture.detectChanges();
    component.exchangeJobAssociations = [];
    component.exchangeJobAssociationsToRemove = [];
    fixture.detectChanges();

    const saveButton = fixture.debugElement.nativeElement.querySelector('button.save-button');

    expect(saveButton.disabled).toEqual(true);
  });

  it('should enable the save button if there are saveable changes', () => {
    fixture.detectChanges();
    component.exchangeJobAssociations = [generateMockExchangeJobAssociation()];
    component.exchangeJobAssociationsToRemove = [];
    fixture.detectChanges();

    const saveButton = fixture.debugElement.nativeElement.querySelector('button.save-button');

    expect(saveButton.disabled).toEqual(false);
  });

  it('should dispatch an event to open the warning dialog when cancel is clicked while there are saveable changes', () => {
    fixture.detectChanges();
    component.isSaveButtonEnabled = () => true;

    const cancelButton = fixture.debugElement.nativeElement.querySelector('button.cancel-button');
    cancelButton.click();

    const openWarningAction = new fromJobAssociationActions.CloseModalWithSaveableChanges();
    expect(store.dispatch).toHaveBeenCalledWith(openWarningAction);
  });

  it('should dispatch an event to close the modal when cancel is clicked and there are no saveable changes', () => {
    fixture.detectChanges();
    component.isSaveButtonEnabled = () => false;

    const cancelButton = fixture.debugElement.nativeElement.querySelector('button.cancel-button');
    cancelButton.click();

    const closeModalAction = new fromJobAssociationActions.CloseJobAssociationsModal();
    expect(store.dispatch).toHaveBeenCalledWith(closeModalAction);
  });
});
