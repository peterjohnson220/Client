import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CompanyNote, getDefaultCompanyNote } from 'libs/models/payfactors-api';

import * as fromCompanyNotesModalReducer from '../../reducers';
import * as fromCompanyNotesModalActions from '../../actions';

import { CompanyNotesListComponent } from '../../components';
import { CompanyNotesModalComponent } from './company-notes-modal.component';


describe('CompanyNotesModalComponent', () => {

    let store: MockStore<fromCompanyNotesModalReducer.State>;
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
        component.open(1, 'TestCompany', false);
        expect(ngbModal.open).toHaveBeenCalled();
    });

    it('should use modal service to dismiss modal when close is called', () => {
        spyOn(ngbModal, 'dismissAll');
        component.close();
        expect(ngbModal.dismissAll).toHaveBeenCalled();
    });

    it('should dispatch LoadCompanyNotes action on open', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompanyNotesModalActions.LoadCompanyNotes({ companyId: 1});
        component.open(1, 'TestCompany', false);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch ResetCompanyNotes action on close', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompanyNotesModalActions.ResetCompanyNotes();
        component.close();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch SaveCompanyNote action on submit', () => {
        spyOn(component.store, 'dispatch');
        note.CreateDate = new Date(Date.now());
        const expectedAction = new fromCompanyNotesModalActions.SaveCompanyNote({note: note, actionType: 'Insert'});
        component.companyId = 1;
        component.userId = -1;
        component.submit();
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

});
