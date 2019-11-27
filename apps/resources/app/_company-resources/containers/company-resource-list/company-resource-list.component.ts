import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CompanyResource, OrphanedCompanyResource, CompanyResourceFolder } from '../../models';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
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
  deleteResourceSuccess$: Observable<boolean>;
  deleteFolderSuccess$: Observable<boolean>;

  private deleteResourceSuccessSubscription: Subscription;
  private deleteFolderSuccessSubscription: Subscription;

  constructor(
    private httpUrlEncodingCodec: HttpUrlEncodingCodec,
    private modalService: NgbModal,
    private store: Store<fromCompanyResourcesPageReducer.State>) {}

  ngOnInit() {
    this.deleteResourceSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingCompanyResourceSuccess);
    this.deleteFolderSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getDeletingFolderFromCompanyResourcesSuccess);
    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.deleteResourceSuccessSubscription.unsubscribe();
    this.deleteFolderSuccessSubscription.unsubscribe();
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

  formatFileUrl(resource: CompanyResource): string {
    return `${BASE_LINK}${this.httpUrlEncodingCodec.encodeValue(resource.FileName)}`;
  }

  openDeleteResourceModal(resource) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.resource = resource;
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
  }
}
