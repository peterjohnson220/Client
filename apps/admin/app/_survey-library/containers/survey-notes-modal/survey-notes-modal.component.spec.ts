import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SurveyNote, getDefaultSurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';

import * as fromSurveyNotesReducer from '../../reducers';
import * as fromSurveyNotesActions from '../../actions/survey-notes.actions';
import { SurveyNotesListComponent } from '../../components';
import * as fromSurveyActions from '../../actions/survey-actions';
import { generateMockSurveyGridItem } from '../../models';
import { SurveyNotesModalComponent } from './survey-notes-modal.component';


describe('SurveyNotesModalComponent', () => {

    let store: MockStore<fromSurveyNotesReducer.State>;
    let component: SurveyNotesModalComponent;
    let fixture: ComponentFixture<SurveyNotesModalComponent>;
    let ngbModal: NgbModal;
    let timeNow;
    const realDate = Date;
    const note: SurveyNote = getDefaultSurveyNote();

    beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            MomentModule,
            FormsModule,
            ReactiveFormsModule,
            NgbModalModule,
        ],
        declarations: [
            SurveyNotesModalComponent,
            SurveyNotesListComponent
         ],
        providers: [
            provideMockStore({}),
            {
                provide: NgbModal,
                useValue: { open: jest.fn(), dismissAll: jest.fn() },
            }
        ],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SurveyNotesModalComponent);
    component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurveyNotesModalComponent);
        component = fixture.componentInstance;
        ngbModal = TestBed.inject(NgbModal);
        fixture.detectChanges();
    });

    beforeAll(() => {
        timeNow = Date.now();
        const _GLOBAL: any = global;
        _GLOBAL.Date = class {
          public static now() {
            return timeNow;
          }

          constructor() {
            return timeNow;
          }

          public valueOf() {
            return timeNow;
          }
        };
      });

      afterAll(() => {
        global.Date = realDate;
      });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should use modal service to open modal when open is called', () => {
        spyOn(ngbModal, 'open');
        component.open(note);
        expect(ngbModal.open).toHaveBeenCalled();
    });

    it('should use modal service to dismiss modal when close is called', () => {
        spyOn(ngbModal, 'dismissAll');
        component.noteInfo = generateMockSurveyGridItem();
        component.close();
        expect(ngbModal.dismissAll).toHaveBeenCalled();
    });

    it('should dispatch LoadSurveyNotes action on open', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromSurveyNotesActions.LoadSurveyNotes({ surveyId: 1});
        component.open(note);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch ResetSurveyNotes action on close', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromSurveyNotesActions.ResetSurveyNotes();
        component.noteInfo = generateMockSurveyGridItem();
        component.close();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch SaveCompanyNote action on submit', () => {
        spyOn(component.store, 'dispatch');
        note.CreateDate = new Date(Date.now());
        const expectedAction = new fromSurveyNotesActions.SaveSurveyNote({note: note, actionType: 'Insert'});
        component.noteInfo = generateMockSurveyGridItem();
        component.userId = -1;
        component.submit();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

});
