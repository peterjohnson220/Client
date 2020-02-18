import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CompanyNote, getDefaultCompanyNote } from 'libs/models/payfactors-api';

import * as fromCompanyNotesReducer from '../../reducers';
import * as fromCompanyNotesActions from '../../actions/company-notes.actions';
import { CompanyNotesListComponent } from '../../components';

describe('CompanyNotesListComponent', () => {

    let store: MockStore<fromCompanyNotesReducer.State>;
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

    store = TestBed.get(Store);
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
        const expectedAction = new fromCompanyNotesActions.SaveCompanyNote({note, actionType: 'Delete'});
        component.delete(note);
        expect(component.store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
