import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as fromCompanyResourcesModalActions from '../../actions/company-resources-modal.actions';
import * as fromCompanyResourcesReducer from '../../reducers';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import { CompanyResourceFolder } from '../../models/company-resource-folder.model';


@Component({
  selector: 'pf-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.scss']
})
export class NewFolderModalComponent implements OnInit, OnDestroy {

  folderSuccess: CompanyResourceFolder;
  folderError = { code: '', message: '', isActive: false };
  addNewFolderForm: FormGroup;
  newFolder: CompanyResourceFolder;

  newFolderModalOpen$: Observable<boolean>;
  addingCompanyResourceFolderSuccess$: Observable<any>;
  addingCompanyResourceFolderError$: Observable<any>;

  addingCompanyResourceFolderSuccessSubscription: Subscription;
  addingCompanyResourceFolderErrorSubscription: Subscription;

  constructor(private store: Store<fromCompanyResourcesReducer.State>,
    private formBuilder: FormBuilder) {
    this.newFolderModalOpen$ = this.store.select(fromCompanyResourcesReducer.getNewFolderModalOpen);
    this.addingCompanyResourceFolderSuccess$ = this.store.select(fromCompanyResourcesReducer.getAddingCompanyResourceFolderSuccess);
    this.addingCompanyResourceFolderError$ = this.store.select(fromCompanyResourcesReducer.getAddingCompanyResourceFolderError);

    this.addNewFolderForm = this.formBuilder.group({
      'folderName': ['', [Validators.required, Validators.maxLength(50), this.validateFolderName]]
    });
  }

  ngOnInit() {
    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.addingCompanyResourceFolderSuccessSubscription.unsubscribe();
    this.addingCompanyResourceFolderErrorSubscription.unsubscribe();
  }

  validateFolderName(control: FormControl) {
    const folderName: string = control.value;
    const isEmptyString: boolean = /^ *$/.test(control.value);

    if (folderName) {
      if (folderName.trim().length === 0 || isEmptyString) {
        return {isNullOrWhiteSpace: true};
      }
    }

    return null;
  }

  handleFormSubmit() {
    const name: string = this.addNewFolderForm.controls['folderName'].value.trim();
    const folder: CompanyResourceFolder = {
      FolderName: name,
      CompanyId: 0,
      CompanyResourcesFoldersId: 0,
      CreateDate: null,
      CreateUser: null
    };

    this.store.dispatch(new fromCompanyResourcesActions.AddingCompanyResourceFolder(folder));
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCompanyResourcesModalActions.ClosingNewFolderModal());
  }

  createSubscriptions() {
    this.addingCompanyResourceFolderSuccessSubscription = this.addingCompanyResourceFolderSuccess$.subscribe((response) => {
      if (response) {
        this.store.dispatch(new fromCompanyResourcesActions.GettingCompanyResources());
        this.folderSuccess = response;
        this.folderError.isActive = false;
        this.store.dispatch(new fromCompanyResourcesModalActions.ClosingNewFolderModal());
      }
    });

    this.addingCompanyResourceFolderErrorSubscription = this.addingCompanyResourceFolderError$.subscribe((response) => {
      if (response && response.error) {
        this.folderError.isActive = true;
        this.folderError.code = response.error.error.code;
        this.folderError.message = response.error.error.message;
      }
    });
  }
}
