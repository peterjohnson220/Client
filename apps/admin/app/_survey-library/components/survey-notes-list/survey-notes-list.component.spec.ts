import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FormatPurePipeModule } from 'ngx-date-fns';

import { SurveyNote, getDefaultSurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';
import { PfCommonModule } from 'libs/core';

import * as fromSurveyNotesReducer from '../../reducers';
import * as fromSurveyNotesActions from '../../actions/survey-notes.actions';
import { SurveyNotesListComponent } from './survey-notes-list.component';

describe('SurveyNotesListComponent', () => {

    let store: MockStore<fromSurveyNotesReducer.State>;
    let component: SurveyNotesListComponent;
    let fixture: ComponentFixture<SurveyNotesListComponent>;
    const note: SurveyNote = getDefaultSurveyNote();

    beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            FormatPurePipeModule,
            FormsModule,
            ReactiveFormsModule,
            PfCommonModule
        ],
        declarations: [
            SurveyNotesListComponent
         ],
        providers: [
            provideMockStore({})
        ],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SurveyNotesListComponent);
    component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurveyNotesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch SaveSurveyNote action on delete', () => {
        jest.spyOn(component.store, 'dispatch');
        const expectedAction = new fromSurveyNotesActions.SaveSurveyNote({note, actionType: 'Delete'});
        component.delete(note);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
