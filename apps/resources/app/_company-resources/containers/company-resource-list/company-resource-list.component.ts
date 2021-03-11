import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import { CompanyResource, OrphanedCompanyResource, CompanyResourceFolder } from '../../models';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import * as fromCompanyResourcesPageReducer from '../../reducers';

const BASE_LINK = '/odata/CloudFiles.DownloadCompanyResource?FileName=';
const RESOURCE_TYPE = {
  link: 'Link',
  file: 'File'
};

@Component({
  selector: 'pf-company-resource-list',
  templateUrl: './company-resource-list.component.html',
  styleUrls: ['./company-resource-list.component.scss'],
  providers: [
    HttpUrlEncodingCodec
  ]
})
export class CompanyResourceListComponent implements OnInit, OnDestroy {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @Input() folderResources: CompanyResourceFolder[];
  @Input() orphanedResources: OrphanedCompanyResource[];
  @Input() hasCompanyResourcesAddEditDeletePermission: boolean;

  deleteResourceSuccess$: Observable<boolean>;
  deleteResourceSuccessSubscription: Subscription;
  deleteFolderSuccess$: Observable<boolean>;
  deleteFolderSuccessSubscription: Subscription;
  enableFileDownloadSecurityWarning$: Observable<boolean>;
  enableFileDownloadSecurityWarningSub: Subscription;
  enableFileDownloadSecurityWarning = false;
  folderStates = {};
  resource: CompanyResource;

  constructor(
    private httpUrlEncodingCodec: HttpUrlEncodingCodec,
    private modalService: NgbModal,
    private store: Store<fromCompanyResourcesPageReducer.State>,
    private settingService: SettingsService) {
      this.enableFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
    }

  ngOnInit() {
    this.deleteResourceSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingCompanyResourceSuccess);
    this.deleteFolderSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingFolderFromCompanyResourcesSuccess);
    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.deleteResourceSuccessSubscription.unsubscribe();
    this.deleteFolderSuccessSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSub.unsubscribe();
  }

  onFolderSelect(folderName: string) {
    this.folderStates[folderName] = !this.folderStates[folderName];
  }

  setFolderIcon(folderName: string) {
    return this.folderStates[folderName] ? 'folder' : 'folder-open';
  }

  setResourceIcon(resource: CompanyResource) {
    if (typeof resource === 'undefined') {
      return;
    }

    return resource.ResourceType === RESOURCE_TYPE.link ? 'link' : 'download';
  }

  setFontWeight(folderName: string) {
    return this.folderStates[folderName] ? 'normal' : 'bold';
  }

  isLink(resource: CompanyResource): boolean {
    return resource.ResourceType === RESOURCE_TYPE.link ? true : false;
  }

  formatFileUrl(resourceFileName: string): string {
    return `${BASE_LINK}${this.httpUrlEncodingCodec.encodeValue(resourceFileName)}`;
  }

  openDeleteResourceModal(resource) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.resource = resource;
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.downloadResource();
    }
  }

  handleResourceClicked(resource: CompanyResource) {
    this.resource = resource;
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.downloadResource();
    }
  }

  downloadResource() {
    const resourceUrl = this.formatFileUrl(this.resource.FileName);
    const link = document.createElement('a');
    link.setAttribute('href', resourceUrl);
    link.setAttribute('download', this.resource.FileDisplayName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private createSubscriptions() {
    this.deleteResourceSuccessSubscription = this.deleteResourceSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });

    this.deleteFolderSuccessSubscription = this.deleteFolderSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });

    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }
}
