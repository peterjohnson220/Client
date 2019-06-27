import { Component, ViewChild, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-company-tags-modal',
  templateUrl: './company-tags-modal.component.html',
  styleUrls: ['./company-tags-modal.component.scss']
})

export class CompanyTagsModalComponent {
    @ViewChild('companyTagsModal', { static: true })
    companyTagsModal: any;

    private displaySpinner = true;
    private entityType = 'Company';
    private companyId: number;
    private protocol: string;
    private host: string;

    private modalRef: NgbModalRef;
    private iframeUrl: SafeResourceUrl;

    private taggingEntitiesCloseMessageType = '[Legacy Content/Tagging Entities] Close Tagging Entities Modal';
    private taggingEntitiesLoadMessageType = '[Legacy Content/Tagging Entities] Load Tag Information';

    constructor(
      private modalService: NgbModal,
      private sanitizer: DomSanitizer,
      private router: ActivatedRoute
    ) {
      this.companyId = this.router.snapshot.params.companyId;
      this.protocol = window.location.protocol;
      this.host = window.location.host;
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.protocol}//${this.host}/client/legacy-content/peer/tag-entities?et=${this.entityType}&id=${this.companyId}`);
    }

    open() {
      this.modalRef = this.modalService.open(this.companyTagsModal, { backdrop: 'static', size: 'lg' });
      this.displaySpinner = true;
    }

    @HostListener('window:message', ['$event'])
    onMessage(event) {
      const type = event.data.type;
      if (type === this.taggingEntitiesLoadMessageType) {
        this.displaySpinner = false;
      } else if (type === this.taggingEntitiesCloseMessageType) {
        this.modalRef.close();
    }
  }
}
