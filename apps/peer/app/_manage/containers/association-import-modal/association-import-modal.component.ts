import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ErrorEvent, UploadEvent, FileRestrictions, RemoveEvent } from '@progress/kendo-angular-upload';
import { SuccessEvent, FileInfo } from '@progress/kendo-angular-upload';

import { Exchange } from 'libs/models/peer';
import { ImportActionEnum } from 'libs/constants';
import { ExchangeJobMappingService } from 'libs/features/peer/exchange-job-mapping/services';

import * as fromSharedPeerReducer from '../../../shared/reducers';
import * as fromPeerManagementReducer from '../../reducers';
import * as importAssociationAction from '../../actions/import.actions';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import { ImportStatusEnum } from '../../actions/import.actions';

@Component({
    selector: 'pf-association-import-modal',
    templateUrl: './association-import-modal.component.html'
})

export class AssociationImportModalComponent implements OnInit, OnDestroy {
    ImportActionEnum = ImportActionEnum;

    exchange$: Observable<Exchange>;

    exchangeJobRequestForm: FormGroup;
    exchangeSubscription: Subscription;
    exchange: Exchange;

    // upload
    uploadSaveUrl = '/odata/ExchangeJobAssociation/UploadFile';
    uploadRemoveUrl = '/odata/ExchangeJobAssociation/RemoveFile';
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

    importAction: ImportActionEnum = ImportActionEnum.Append;
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
          if (this.fileUpload !== null) {
            this.switchStatus(ImportStatusEnum.InProcess);
            this.exchangeJobMappingService.validateAndLoadAssociations(
              this.fileUpload, this.exchange.ExchangeId, this.importAction
            ).subscribe(
              res => {
                this.uploadResult = res;
                if (this.uploadResult.Success) {
                  this.switchStatus(ImportStatusEnum.Success);
                  this.Restart();
                  this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
                } else {
                  this.Restart();
                  this.Error();
                }
              });
          }
        }
    }

    handleModalDismissed(): void {
        this.reset();
        this.store.dispatch(new importAssociationAction.SwitchAssociationImportModalOpenAction(false));
        this.importAction = ImportActionEnum.Append;
    }

    // Upload events
    uploadEventHandler(e: UploadEvent) {
        this.exchangeJobRequestForm.markAsTouched();
        this.uploadResult = null;
    }

    onFileRemove(e: RemoveEvent) {
      e.files[0].name = this.fileUpload;
      this.fileUpload = null;
      if (this.btnText === this.CONST_RESTART) {
        this.btnText = this.CONST_IMPORT;
      }
      this.exchangeJobRequestForm.reset();
      this.uploadResult = null;
    }

    successEventHandler(e: SuccessEvent) {
        if (e.operation === 'upload') {
            this.fileUpload = e.response.body.FileName;
            this.btnText = this.CONST_IMPORT;
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
        this.fileUpload = null;
    }

    private switchStatus(status: ImportStatusEnum): void {
        this.store.dispatch(new importAssociationAction.SwitchAssociationImportStatus(status));
    }

    private reset(): void {
        this.myFiles = new Array<FileInfo>();
        this.uploadResult = null;
        this.btnText = this.CONST_IMPORT;
        this.switchStatus(ImportStatusEnum.Idle);
        this.fileUpload = null;
        this.exchangeJobRequestForm.reset();
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
