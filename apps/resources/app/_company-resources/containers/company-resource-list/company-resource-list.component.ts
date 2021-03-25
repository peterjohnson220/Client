import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import { CompanyResource, OrphanedCompanyResource, CompanyResourceFolder, ResourceType } from '../../models';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import * as fromCompanyResourcesPageReducer from '../../reducers';
import * as fromCompanyResourcesPageActions from '../../actions/company-resources.actions';
import * as fromCompanyResourcesAddResourceActions from '../../actions/company-resources-add-resource.actions';
import { ResourceModalComponent } from '../resource-modal/resource-modal.component';

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
  showRenameResourceModal$: Observable<boolean>;
  showRenameFolderModal$: Observable<boolean>;
  savingFolderNameError$: Observable<string>;

  enableFileDownloadSecurityWarning = false;
  resource: CompanyResource;
  updatedResource: CompanyResource;
  selectedFolder: CompanyResourceFolder;
  originalFolderName: string;
  resourceType = ResourceType;
  selectedResourceDropdown: NgbDropdown;
  selectedFolderDropdown: NgbDropdown;
  readonly BASE_LINK = '/odata/CloudFiles.DownloadCompanyResource?FileName=';

  constructor(
    private httpUrlEncodingCodec: HttpUrlEncodingCodec,
    private modalService: NgbModal,
    private store: Store<fromCompanyResourcesPageReducer.State>,
    private settingService: SettingsService
  ) {
    this.enableFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
    this.showRenameResourceModal$ = this.store.select(fromCompanyResourcesPageReducer.getShowRenameResourceModal);
    this.showRenameFolderModal$ = this.store.select(fromCompanyResourcesPageReducer.getShowRenameFolderModal);
    this.savingFolderNameError$ = this.store.select(fromCompanyResourcesPageReducer.getSavingFolderNameError);
  }

  ngOnInit() {
    this.deleteResourceSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingCompanyResourceSuccess);
    this.deleteFolderSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingFolderFromCompanyResourcesSuccess);
    this.createSubscriptions();
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy() {
    this.deleteResourceSuccessSubscription.unsubscribe();
    this.deleteFolderSuccessSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSub.unsubscribe();
  }

  formatFileUrl(resourceFileName: string): string {
    return `${this.BASE_LINK}${this.httpUrlEncodingCodec.encodeValue(resourceFileName)}`;
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

  trackByResource(index: any, item: CompanyResource): number {
    return item.CompanyResourceId;
  }

  handleResourceActionButtonClicked(resource: CompanyResource): void {
    this.resource = this.resource?.CompanyResourceId !== resource?.CompanyResourceId
      ? resource
      : null;
  }

  handleFolderActionButtonClicked(): void {
    this.resource = null;
  }

  handleResourceClicked(resource: CompanyResource): void {
    this.resource = resource;
    if (this.resource.ResourceType === this.resourceType.Link) {
      window.open(this.resource.LinkUrl);
    } else if (this.enableFileDownloadSecurityWarning) {
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

  trackByFolder(index: any, item: CompanyResourceFolder): number {
    return item.CompanyResourcesFoldersId;
  }

  resourceActionsOpenChanged(dropdown: NgbDropdown, isOpen: boolean): void {
    this.selectedResourceDropdown = isOpen ? dropdown : null;
    if (!isOpen) {
      this.resource = null;
    }
  }

  folderActionsOpenChanged(dropdown: NgbDropdown, isOpen: boolean): void {
    this.selectedFolderDropdown = isOpen ? dropdown : null;
    if (!isOpen) {
      this.resource = null;
    }
  }

  onScroll = (): void => {
    if (!!this.selectedResourceDropdown) {
      this.selectedResourceDropdown.close();
    }
    if (!!this.selectedFolderDropdown) {
      this.selectedFolderDropdown.close();
    }
  }

  handleResourceTitleChanged(value: string): void {
    this.updatedResource.ResourceTitle = value;
  }

  updateResourceTitle(): void {
    if (!this.updatedResource?.ResourceTitle?.length) {
      return;
    }
    this.store.dispatch(new fromCompanyResourcesPageActions.UpdateResourceTitle({
      companyResourceId: this.updatedResource.CompanyResourceId,
      companyResourceFolderId: this.updatedResource.CompanyResourcesFoldersId,
      title: this.updatedResource.ResourceTitle
    }));
  }

  openRenameResourceModal(resource: CompanyResource): void {
    this.updatedResource = cloneDeep(resource);
    this.store.dispatch(new fromCompanyResourcesPageActions.OpenRenameResourceModal());
  }

  closeRenameResourceModal(): void {
    this.updatedResource = null;
    this.store.dispatch(new fromCompanyResourcesPageActions.CloseRenameResourceModal());
  }

  handleFolderNameChanged(value: string): void {
    this.selectedFolder.FolderName = value;
  }

  updateFolderName(): void {
    if (!this.selectedFolder?.FolderName?.length) {
      return;
    }
    this.store.dispatch(new fromCompanyResourcesPageActions.UpdateFolderName({
      companyResourcesFolderId: this.selectedFolder.CompanyResourcesFoldersId,
      folderName: this.selectedFolder.FolderName
    }));
  }

  openRenameFolderModal(folder: CompanyResourceFolder): void {
    this.selectedFolder = cloneDeep(folder);
    this.originalFolderName = folder.FolderName;
    this.store.dispatch(new fromCompanyResourcesPageActions.OpenRenameFolderModal());
  }

  closeRenameFolderModal(): void {
    this.selectedFolder = null;
    this.store.dispatch(new fromCompanyResourcesPageActions.CloseRenameFolderModal());
  }

  openResourceModal(folder: CompanyResourceFolder): void {
    this.modalService.open(ResourceModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.OpenAddResourceModal(folder.FolderName));
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
