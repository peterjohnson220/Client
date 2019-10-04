import { Component, Input } from '@angular/core';
import { CompanyResource, OrphanedCompanyResource, CompanyResourceFolder } from '../../models';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import * as fromCompanyResourcesReducer from '../../reducers';
import { Store } from '@ngrx/store';


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
export class CompanyResourceListComponent {

  @Input() folderResources: CompanyResourceFolder[];
  @Input() orphanedResources: OrphanedCompanyResource[];
  folderStates = {};

  constructor(private httpUrlEncodingCodec: HttpUrlEncodingCodec, private store: Store<fromCompanyResourcesReducer.State>) {}

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

  deleteResource(resourceId) {
    this.store.dispatch(new fromCompanyResourcesActions.DeletingCompanyResource(resourceId));
  }

  deleteFolder(folderId) {
    this.store.dispatch(new fromCompanyResourcesActions.DeletingFolderFromCompanyResources(folderId));
  }
}
