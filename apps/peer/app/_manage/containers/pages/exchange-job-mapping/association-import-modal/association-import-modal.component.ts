import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';

import { map, catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Exchange } from 'libs/models/peer/index';

import * as fromSharedPeerReducer from '../../../../../shared/reducers/index';
import * as fromPeerManagementReducer from '../../../../reducers/index';
import * as importAssociationAction from '../../../../actions/import.actions';
import { ImportStatusEnum } from '../../../../actions/import.actions';
import { ExchangeJobMappingService } from '../../../../services/exchange-job-mapping.service';

import { ErrorEvent, UploadEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { SuccessEvent, FileInfo } from '@progress/kendo-angular-upload';

@Component({
    selector: 'pf-association-import-modal',
    templateUrl: './association-import-modal.component.html'
})

export class AssociationImportModalComponent implements OnInit, OnDestroy {
    exchange$: Observable<Exchange>;

    exchangeJobRequestForm: FormGroup;
    exchangeSubscription: Subscription;
    exchange: Exchange;

    // upload
    uploadSaveUrl = '/payfactors/upload/upload';
    uploadRemoveUrl = 'removeUrl';
    public uploadRestrictions: FileRestrictions = {
        allowedExtensions: ['.xlx', '.xlsx']
    };

    importStatus$: Observable<ImportStatusEnum>;
    importAssociationModalOpen$: Observable<boolean>;
    importStatus = ImportStatusEnum;
    btnText: string;
    fileUpload: any;
    uploadResult: any;
    myFiles: Array<FileInfo>;

    CONST_RESTART = 'Restart';
    CONST_IMPORT = 'Import';

    constructor(
        private store: Store<fromPeerManagementReducer.State>,
        private sharedPeerStore: Store<fromSharedPeerReducer.State>,
        private fb: FormBuilder,
        private exchangeJobMappingService: ExchangeJobMappingService,
    ) {
        this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
        this.importStatus$ = this.store.select(fromPeerManagementReducer.getImportStatus);
        this.importAssociationModalOpen$ = this.store.select(fromPeerManagementReducer.getIsImportModalOpen);
        this.createForm();
        this.reset();
    }

    createForm(): void {
        this.exchangeJobRequestForm = this.fb.group({});
    }

    // Modal events
    handleFormSubmit(): void {
        if (this.btnText === this.CONST_RESTART) {
            this.reset();
        } else if (this.btnText === this.CONST_IMPORT) {
            alert('Use the "Select files..." button above ');
        }
    }

    handleModalDismissed(): void {
        this.reset();
        this.store.dispatch(new importAssociationAction.SwitchAssociationImportModalOpenAction(false));
    }

    // Upload events
    uploadEventHandler(e: UploadEvent) {
        this.switchStatus(ImportStatusEnum.InProcess);
    }

    successEventHandler(e: SuccessEvent) {
        if (e.operation === 'upload') {
            this.fileUpload = e.response.body.FileName;

            this.exchangeJobMappingService.validateAndLoadAssociations(this.fileUpload, this.exchange.ExchangeId).subscribe(
                res => {
                    this.uploadResult = res;
                    if (this.uploadResult.success) {
                        this.switchStatus(ImportStatusEnum.Success);
                        this.Restart();
                        this.exchangeJobMappingService.loadExchangeJobMappings();
                    } else {
                        this.Restart();
                        this.Error();
                    }
                });
        }
    }



    errorEventHandler(e: ErrorEvent) {
        this.Restart();
        this.Error();
    }

    private Error(): void {
        this.switchStatus(ImportStatusEnum.Failed);
    }

    private Restart(): void {
        this.exchangeJobRequestForm.markAsDirty();
        this.btnText = this.CONST_RESTART;
    }

    private switchStatus(status: ImportStatusEnum): void {
        this.store.dispatch(new importAssociationAction.SwitchAssociationImportStatus(status));
    }

    private reset(): void {
        this.myFiles = new Array<FileInfo>();
        this.uploadResult = null;
        this.btnText = this.CONST_IMPORT;
        this.switchStatus(ImportStatusEnum.Idle);
    }


    // Lifecycle Events
    ngOnInit(): void {
        this.exchangeSubscription = this.exchange$.subscribe(e => {
            this.exchange = e;
        });
    }

    ngOnDestroy(): void {
        this.exchangeSubscription.unsubscribe();
    }
}
