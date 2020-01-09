import { Component, ViewChild, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as fromCompanyControlReducer from '../../reducers';
import * as fromCompanyControlAction from '../../actions';

@Component({
  selector: 'pf-company-control-copy-modal',
  templateUrl: './company-control-copy-modal.component.html',
  styleUrls: ['./company-control-copy-modal.component.scss']
})
export class CompanyControlCopyModalComponent implements OnInit, OnDestroy {
    @ViewChild('copyControlModal', {static: true}) public copyControlModal: any;

    @Output() copyControlComplete = new EventEmitter();

    private modalRef: NgbModalRef;
    private copyControlForm: FormGroup;
    public errorValidationMessage = '';

    private copying$: Observable<boolean>;
    private copyingControlSuccess$: Observable<boolean>;
    private copyingControlError$: Observable<boolean>;
    private copyingControlErrorMessage$: Observable<string>;

    private copyingSuccessSubscription: Subscription;
    private copyingErrorSubscription: Subscription;
    private copyingErrorMessageSubscription: Subscription;

    get controlName() { return (this.copyControlForm.get('controlName') ); }

    constructor(
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private store: Store<fromCompanyControlReducer.State>
    ) {
        this.copying$ = this.store.pipe(select(fromCompanyControlReducer.getCopying));
        this.copyingControlSuccess$ = this.store.pipe(select(fromCompanyControlReducer.getCopyingSuccess));
        this.copyingControlError$ = this.store.pipe(select(fromCompanyControlReducer.getCopyingError));
        this.copyingControlErrorMessage$ = this.store.pipe(select(fromCompanyControlReducer.getCopyingErrorMessage));
    }

    open() {
        this.copyControlForm.reset();
        this.modalRef = this.modalService.open(this.copyControlModal, { backdrop: 'static' });
    }

    submit() {
        if (this.copyControlForm.valid) {
            this.store.dispatch(new fromCompanyControlAction.CopyCompanyControl({controlName: this.controlName.value}));
        }
    }

    buildForm() {
        this.copyControlForm = this.formBuilder.group({
            'controlName': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]]
        });
    }

    dismissModal() {
        if (this.modalRef) {
            this.modalRef.close();
            this.copyControlComplete.emit(this.controlName.value);
        }
    }

    ngOnInit() {
        this.buildForm();

        this.copyingErrorMessageSubscription = this.copyingControlErrorMessage$.subscribe(em => this.errorValidationMessage = em);

        this.copyingErrorSubscription = this.copyingControlError$.subscribe(error => {
            if (error) {
                this.controlName.setErrors({'error': this.errorValidationMessage});
            }
        });

        this.copyingSuccessSubscription = this.copyingControlSuccess$.subscribe(success => {
            if (success) {
                this.dismissModal();
            }
        });
    }

    ngOnDestroy() {
        this.copyingSuccessSubscription.unsubscribe();
        this.copyingErrorSubscription.unsubscribe();
        this.copyingErrorMessageSubscription.unsubscribe();
    }
}
