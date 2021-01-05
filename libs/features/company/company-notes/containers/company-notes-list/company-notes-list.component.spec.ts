import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CompanyNote, getDefaultCompanyNote } from 'libs/models/payfactors-api';

import { CompanyNotesListComponent } from './company-notes-list.component';

import * as fromCompanyNotesModalReducer from '../../reducers';
import * as fromCompanyNotesModalActions from '../../actions';

describe('CompanyNotesListComponent', () => {

    let store: MockStore<fromCompanyNotesModalReducer.State>;
    let component: CompanyNotesListComponent;
    let fixture: ComponentFixture<CompanyNotesListComponent>;
    const note: CompanyNote = getDefaultCompanyNote();

    beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            MomentModule,
            FormsModule,
            ReactiveFormsModule,
        ],
        declarations: [
            CompanyNotesListComponent
         ],
        providers: [
            provideMockStore({})
        ],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CompanyNotesListComponent);
    component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyNotesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch SaveCompanyNote action on delete', () => {
        spyOn(component.store, 'dispatch');
        const expectedAction = new fromCompanyNotesModalActions.SaveCompanyNote({note, actionType: 'Delete'});
        component.delete(note);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
