import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserContext } from 'libs/models';
import { CompanyResourceFolder, OrphanedCompanyResource } from '../models/company-resources.model';
import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import * as fromCompanyResourcesPageReducer from '../reducers';
import * as fromRootState from 'libs/state/state';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResourceModalComponent } from '../containers/resource-modal/resource-modal.component';
import { NewFolderModalComponent } from '../containers/new-folder-modal/new-folder-modal.component';

@Component({
  selector: 'pf-company-resources',
  templateUrl: './company-resources.page.html',
  styleUrls: ['./company-resources.page.scss']
})
export class CompanyResourcesPageComponent implements OnInit, OnDestroy {
  companyName: string;
  folderResources$: Observable<CompanyResourceFolder[]>;
  orphanedResources$: Observable<OrphanedCompanyResource[]>;
  companyResourcesLoading$: Observable<boolean>;
  companyResourcesLoadingError$: Observable<boolean>;
  identity$: Observable<UserContext>;
  loadingError$: Observable<boolean>;
  resourceSuccess$: Observable<boolean>;
  folderSuccess$: Observable<boolean>;
  modalReference: NgbModalRef;

  private indentitySubscription: Subscription;
  private addingResourceSuccessSubscription: Subscription;
  private addingFolderSuccessSubscription: Subscription;

  constructor(
    private store: Store<fromCompanyResourcesPageReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.folderResources$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyFolderResources);
    this.orphanedResources$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyOrphanResources);
    this.companyResourcesLoading$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoading);
    this.companyResourcesLoadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.loadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
    this.resourceSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getAddingCompanyResourceSuccess);
    this.folderSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getAddingFolderToCompanyResourcesSuccess);

    this.store.dispatch(new fromCompanyResourcesPageActions.GettingCompanyResources());

    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.indentitySubscription.unsubscribe();
    this.addingResourceSuccessSubscription.unsubscribe();
    this.addingFolderSuccessSubscription.unsubscribe();
  }

  openNewFolderModal() {
    this.modalService.open(NewFolderModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }

  openResourceModal() {
    this.modalService.open(ResourceModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }

  private createSubscriptions() {
    this.indentitySubscription = this.identity$.subscribe((response) => {
      this.companyName = response.CompanyName;
    });

    this.addingResourceSuccessSubscription = this.resourceSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });

    this.addingFolderSuccessSubscription = this.folderSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });
  }
}
