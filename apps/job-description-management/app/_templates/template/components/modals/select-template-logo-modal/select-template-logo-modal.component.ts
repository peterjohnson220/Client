import { Component, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ErrorEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as fromJdmSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromJdmSharedActions from 'libs/features/jobs/job-description-management/actions';
import { CompanyLogo } from 'libs/features/jobs/job-description-management';

@Component({
    selector: 'pf-select-template-logo-modal',
    templateUrl: './select-template-logo-modal.component.html',
    styleUrls: ['./select-template-logo-modal.component.scss']
})

export class SelectTemplateLogoModalComponent implements OnDestroy {

    @ViewChild('selectTemplateLogoModal', {static: true}) public selectTemplateLogoModal: any;
    @Input() companyId: number;
    @Output() logoSelectedComplete = new EventEmitter();

    public companyLogosLoading$: Observable<boolean>;
    public companyLogosLoadingError$: Observable<boolean>;
    public companyLogosLoadingErrorMessage$: Observable<string>;
    private companyLogos$: Observable<CompanyLogo[]>;
    private companyLogosSubscription: Subscription;

    public errorMessage = '';
    private modalRef: NgbModalRef;
    private selectedCompanyLogo: CompanyLogo;
    private uploadUrl = '/odata/CloudFiles.UploadCompanyLogo?CompanyID=';
    private uploadComplete = false;
    private uploadedFileName = '';

    constructor(
      private sharedJdmStore: Store<fromJdmSharedReducer.State>,
      private modalService: NgbModal
    ) {

      this.companyLogos$ = this.sharedJdmStore.select(fromJdmSharedReducer.getCompanyLogos);
      this.companyLogosLoading$ = this.sharedJdmStore.select(fromJdmSharedReducer.getCompanyLogosLoading);
      this.companyLogosLoadingError$ = this.sharedJdmStore.select(fromJdmSharedReducer.getCompanyLogosLoadingError);
      this.companyLogosLoadingErrorMessage$ = this.sharedJdmStore.select(fromJdmSharedReducer.getCompanyLogosLoadingErrorMessage);

      this.companyLogosSubscription = this.companyLogos$.subscribe(companyLogos => {
          if (this.uploadComplete) {
              this.selectedCompanyLogo = companyLogos.find(companyLogo => companyLogo.DisplayName === this.uploadedFileName);
          }
      });
    }

    completeEventHandler() {
        this.uploadComplete = true;
        this.loadCompanyLogos();
    }

    errorEventHandler(e: ErrorEvent) {
        this.errorMessage = e.response.statusText;
    }

    handleLogoClicked(selectedLogoUrl) {
        this.selectedCompanyLogo = selectedLogoUrl;
    }

    loadCompanyLogos() {
        this.sharedJdmStore.dispatch(new fromJdmSharedActions.LoadAvailableCompanyLogos());
    }

    ngOnDestroy() {
        this.companyLogosSubscription.unsubscribe();
    }

    open() {
        this.selectedCompanyLogo = null;
        this.errorMessage = '';
        this.loadCompanyLogos();
        this.modalRef = this.modalService.open(this.selectTemplateLogoModal, { backdrop: 'static', size: 'lg' });
        this.uploadUrl = this.uploadUrl + this.companyId;
    }

    submit() {
        this.logoSelectedComplete.emit(this.selectedCompanyLogo);
        this.modalRef.close();
    }

    uploadEventHandler(e: UploadEvent) {
        this.errorMessage = '';
        this.uploadComplete = false;
        this.uploadedFileName = e.files['0'].name;
    }
}
