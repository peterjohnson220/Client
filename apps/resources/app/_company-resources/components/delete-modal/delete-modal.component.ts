import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import * as fromCompanyResourcesReducer from '../../reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pf-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  @Input() resource;
  isFolder: boolean;

  constructor(public activeModal: NgbActiveModal, private store: Store<fromCompanyResourcesReducer.State>) { }

  ngOnInit() {
    this.isFolder = this.resource.CompanyResources ? true : false;
  }

  setModalTitle(): string {
    return this.isFolder ? 'Delete resource folder' : 'Delete resource';
  }

  setResourceName(): string {
    return this.isFolder ? this.resource.FolderName : this.resource.ResourceTitle;
  }

  setDeleteMessage(): string {
    if (this.isFolder) {
      return `Are you sure you want to delete <span class="font-weight-bold">${this.setResourceName()}</span>?
      All resources in this folder will also be deleted. This action is permanent and cannot be recovered.`;
    } else {
      return `Are you sure you want to delete <span class="font-weight-bold">${this.setResourceName()}</span>?
      This action is permanent and cannot be recovered.`;
    }
  }

  delete() {
    if (this.isFolder) {
      this.store.dispatch(new fromCompanyResourcesActions.DeletingFolderFromCompanyResources(this.resource.CompanyResourcesFoldersId));
    } else {
      this.store.dispatch(new fromCompanyResourcesActions.DeletingCompanyResource(this.resource.CompanyResourceId));
    }
  }

}
