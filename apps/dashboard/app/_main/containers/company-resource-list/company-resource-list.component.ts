import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CompanyResource, OrphanedCompanyResource, CompanyResourceFolder } from '../../models';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
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

  @Input() folderResources: CompanyResourceFolder[];
  @Input() orphanedResources: OrphanedCompanyResource[];
  folderStates = {};
  deleteSuccess$: Observable<boolean>;

  private deleteSuccessSubscription: Subscription;

  constructor(
    private httpUrlEncodingCodec: HttpUrlEncodingCodec,
    private modalService: NgbModal,
    private store: Store<fromCompanyResourcesPageReducer.State>) {}

  ngOnInit() {
    this.deleteSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingCompanyResourceSuccess);
    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.deleteSuccessSubscription.unsubscribe();
  }

  onFolderSelect(folderId: string) {
    this.folderStates[folderId] = !this.folderStates[folderId];
  }

  setFolderIcon(folderId: string) {
    return this.folderStates[folderId] ? 'folder' : 'folder-open';
  }

  setResourceIcon(resource: CompanyResource) {
    if (typeof resource === 'undefined') {
      return;
    }

    return resource.ResourceType === RESOURCE_TYPE.link ? 'link' : 'download';
  }

  setFontWeight(folderId: string) {
    return this.folderStates[folderId] ? 'normal' : 'bold';
  }

  isLink(resource: CompanyResource): boolean {
    return resource.ResourceType === RESOURCE_TYPE.link ? true : false;
  }

  formatFileUrl(resource: CompanyResource): string {
    return `${BASE_LINK}${this.httpUrlEncodingCodec.encodeValue(resource.FileName)}`;
  }

  openDeleteResourceModal(resource: CompanyResource) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.resource = resource;
  }

  private createSubscriptions() {
    this.deleteSuccessSubscription = this.deleteSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });
  }
}
