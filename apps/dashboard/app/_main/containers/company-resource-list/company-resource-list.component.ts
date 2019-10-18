import { Component, Input } from '@angular/core';
import { CompanyResources, CompanyResource } from '../../models';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import * as fromCompanyResourcesModalActions from '../../actions/company-resources-modal.actions';
import * as fromCompanyResourcesModalReducer from '../../reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


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

  @Input() companyResources: CompanyResources;
  folderStates = {};
  newFolderModalOpen$: Observable<boolean>;

  constructor(private httpUrlEncodingCodec: HttpUrlEncodingCodec, private store: Store<fromCompanyResourcesModalReducer.State>) {
      this.newFolderModalOpen$ = this.store.select(fromCompanyResourcesModalReducer.getNewFolderModalOpen);
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

  openNewFolderModal() {
    this.store.dispatch(new fromCompanyResourcesModalActions.OpeningNewFolderModal());
  }
}
