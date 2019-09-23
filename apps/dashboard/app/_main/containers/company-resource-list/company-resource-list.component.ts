import { Component, Input } from '@angular/core';
import { CompanyResources, CompanyResource } from '../../models';
import { HttpUrlEncodingCodec } from '@angular/common/http';

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
  folders = {};

  constructor(private httpUrlEncodingCodec: HttpUrlEncodingCodec) {}

  onFolderSelect(folderId: string) {
    this.folders[folderId] = !this.folders[folderId];
  }

  setFolderIcon(folderId: string) {
    return this.folders[folderId] ? 'folder' : 'folder-open';
  }

  setResourceIcon(resource: CompanyResource) {
    if (typeof resource === 'undefined') {
      return;
    }

    return resource.ResourceType === RESOURCE_TYPE.link ? 'link' : 'download';
  }

  setFontWeight(folderId: string) {
    return this.folders[folderId] ? 'normal' : 'bold';
  }

  isLink(resource: CompanyResource): boolean {
    return resource.ResourceType === RESOURCE_TYPE.link ? true : false;
  }

  formatFileUrl(resource: CompanyResource): string {
    return `${BASE_LINK}${this.httpUrlEncodingCodec.encodeValue(resource.FileName)}`;
  }
}
