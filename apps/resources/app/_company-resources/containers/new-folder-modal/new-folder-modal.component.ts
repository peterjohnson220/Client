import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import * as fromCompanyResourcesReducer from '../../reducers';
import * as fromCompanyResourcesFolderReducer from '../../reducers';
import { CompanyResourceFolderPost } from '../../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.scss']
})
export class NewFolderModalComponent implements OnInit, OnDestroy {

  folderError = { code: '', message: ''};
  isSubmitted = false;
  addNewFolderForm: FormGroup;
  addingFolderToCompanyResources$: Observable<boolean>;
  addingFolderSuccess$: Observable<any>;
  addingFolderError$: Observable<any>;

  private addingFolderErrorSubscription: Subscription;

  constructor(
    private store: Store<fromCompanyResourcesReducer.State>,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.addingFolderSuccess$ = this.store.select(fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesSuccess);
    this.addingFolderError$ = this.store.select(fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesError);
    this.createForm();
    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.addingFolderErrorSubscription.unsubscribe();
    this.addNewFolderForm.reset();
    this.isSubmitted = false;
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

  onFormSubmit() {
    const name: string = this.addNewFolderForm.controls['folderName'].value.trim();
    const folder: CompanyResourceFolderPost = {
      FolderName: name,
      CompanyId: 0,
      CompanyResourcesFoldersId: 0,
      CreateDate: null,
      CreateUser: null
    };
    this.isSubmitted = true;
    this.store.dispatch(new fromCompanyResourcesActions.AddingFolderToCompanyResources(folder));
  }

  private createForm() {
    this.addNewFolderForm = this.formBuilder.group({
      'folderName': ['', [Validators.required, Validators.maxLength(50), this.validateFolderName]]
    });
  }

  private createSubscriptions() {
    this.addingFolderErrorSubscription = this.addingFolderError$.subscribe((response) => {
      if (response && response.error) {
        this.folderError.code = response.error.error.code;
        this.folderError.message = response.error.error.message;
      }
    });
  }
}
