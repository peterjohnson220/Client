import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CompanyNote, getDefaultCompanyNote } from 'libs/models/payfactors-api';

import * as fromCompanyNotesReducer from '../../reducers';
import * as fromCompanyNotesActions from '../../actions/company-notes.actions';
import { CompanyNotesListComponent } from '../../components';
import * as fromCompaniesActions from '../../actions/companies.actions';
import { generateMockCompanyGridItem } from '../../models';
import { CompanyNotesModalComponent } from './company-notes-modal.component';


describe('CompanyNotesModalComponent', () => {

    let store: MockStore<fromCompanyNotesReducer.State>;
    let component: CompanyNotesModalComponent;
    let fixture: ComponentFixture<CompanyNotesModalComponent>;
    let ngbModal: NgbModal;
    let timeNow;
    const realDate = Date;
    const note: CompanyNote = getDefaultCompanyNote();

    beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            MomentModule,
            FormsModule,
            ReactiveFormsModule,
            NgbModalModule,
        ],
        declarations: [
            CompanyNotesModalComponent,
            CompanyNotesListComponent
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
    fixture = TestBed.createComponent(CompanyNotesModalComponent);
    component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyNotesModalComponent);
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
        component.close();
        expect(ngbModal.dismissAll).toHaveBeenCalled();
    });

    it('should dispatch LoadCompanyNotes action on open', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompanyNotesActions.LoadCompanyNotes({ companyId: 1});
        component.open(note);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch ResetCompanyNotes action on close', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompanyNotesActions.ResetCompanyNotes();
        component.close();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch LoadCompanies action on close', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompaniesActions.LoadCompanies();
        component.close();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch SaveCompanyNote action on submit', () => {
        spyOn(component.store, 'dispatch');
        note.CreateDate = new Date(Date.now());
        const expectedAction = new fromCompanyNotesActions.SaveCompanyNote({note: note, actionType: 'Insert'});
        component.companyInfo = generateMockCompanyGridItem();
        component.userId = -1;
        component.submit();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

});
