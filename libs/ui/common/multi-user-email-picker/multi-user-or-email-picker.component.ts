import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';

import { CompanyApiService } from '../../../data/payfactors-api/company';
import { UserApiService } from '../../../data/payfactors-api/user';
import { UserContext } from '../../../models/security';
import { RegexStrings } from '../../../constants';
import { PfConstants } from '../../../models/common';

@Component({
  selector: 'pf-multi-user-or-email-picker',
  templateUrl: './multi-user-or-email-picker.component.html',
  styleUrls: ['./multi-user-or-email-picker.component.scss']
})

export class MultiUserOrEmailPickerComponent implements OnInit, OnDestroy {
  @ViewChild('pickerArea') public pickerArea: any;
  @Input() companyId: number;
  @Input() nameToExclude: string;
  @Input() loaderType: string;
  @Input() loaderConfigurationGroupId: number;
  @Input() jobIds: number[];
  @Input() workflow: boolean;
  @Input() requiresName: boolean;
  @Input() selectedEmails!: {
    CompanyId: string;
    UserId: string;
    EmailAddress: string;
    FirstName: string;
    LastName: string;
    UserPicture: string;
  }[];
  @Output() selected = new EventEmitter();
  @Output() selectedEmailsChange = new EventEmitter();

  identity$: Observable<UserContext>;
  identitySubscription: Subscription;

  avatarUrl: string;
  model: any;
  searching = false;
  searchFailed = false;
  emailAlreadyAdded = false;
  recipients;
  selectedListSize = 0;
  selectedListHash = {};
  searchValue = '';
  private restrictWorkflowToCompanyEmployeesOnly: boolean;

  constructor(private companyApiService: CompanyApiService,
    private userApiService: UserApiService,
    private userContextStore: Store<fromRootState.State>) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(i => {
      if (i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
        this.companyApiService.get(i.CompanyId).subscribe(company => {
          this.restrictWorkflowToCompanyEmployeesOnly = company.RestrictWorkflowToCompanyEmployeesOnly;
      });
      }
    });
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if(this.selectedEmails) {
      if(this.selectedListSize !== this.selectedEmails.length) {
        this.scrollToBottom();
        this.selectedListSize = this.selectedEmails.length;
      }
      if(this.selectedEmails.length !== Object.keys(this.selectedListHash).length) {
        this.selectedListHash = {};
        this.selectedEmails.forEach((el, index) => {
          this.selectedListHash[el.EmailAddress] = index;
        })
      }
    }
  }

  handleItemSelected(event: NgbTypeaheadSelectItemEvent) {
    this.model = null;
    event.preventDefault();

    if (Object.keys(event.item).length !== 0) {
      const payload = {
        CompanyId: event.item.CompanyId,
        UserId: event.item.UserId,
        EmailAddress: event.item.EmailAddress,
        FirstName: event.item.FirstName,
        LastName: event.item.LastName,
        UserPicture: event.item.UserPicture
      };
      if(this.selectedListHash[event.item.EmailAddress] == null) {
        this.selectedEmails.push(payload);
        this.selectedListHash[event.item.EmailAddress] = this.selectedEmails.length - 1;
      } else {
        this.emailAlreadyAdded = true;
      }
      this.selected.emit(payload);
      this.selectedEmailsChange.emit(this.selectedEmails);
    }
  }

  // Handles removing from the email list; will emit the new email list when it's done
  handleRemoveClicked(index: number) {
    if(this.selectedEmails.length >= 1) {
      delete this.selectedListHash[this.selectedEmails[index].EmailAddress];
      this.selectedEmails.splice(index, 1);
    }
    this.selectedEmailsChange.emit(this.selectedEmails);
  }

  // Handle if user presses backspace when search is empty; will remove the most recent entry in email list
  handleSearchKeyUp($event) {
    if($event.target.value === '' && this.searchValue === '' && $event.key === 'Backspace') {
      this.handleRemoveClicked(this.selectedEmails.length - 1);
    }
    this.searchValue = $event.target.value;
  }

  // Handles when the user adds multiple emails and ends up going over the preset height
  scrollToBottom() {
    try {
        this.pickerArea.nativeElement.scrollTop = this.pickerArea.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    if (!this.workflow) {
      this.recipients = this.userApiService.getEmailRecipientsSearchResults(this.companyId, term, this.loaderType, this.loaderConfigurationGroupId).pipe(
        map((results: any) => this.handleEmailRecipientsResponse(results, term)));
    } else if (this.jobIds) {
      this.recipients = this.userApiService.jobPicker(term, this.jobIds).pipe(map((results: any) => this.handleEmailRecipientsResponse(results, term)));
    } else {
      this.recipients = this.userApiService.picker(term).pipe(map((results: any) => this.handleEmailRecipientsResponse(results, term)));
    }

    return this.recipients;
  }

  private handleEmailRecipientsResponse(results: any, term: string) {
    let returnVal = [{}];
    if (results.length) {
      returnVal = results;
    } else if (!this.restrictWorkflowToCompanyEmployeesOnly) {
      returnVal = RegExp(RegexStrings.EMAIL, 'i').test(term) ? [{ EmailAddress: term }] : returnVal;
    }
    return returnVal;
  }

  clearModel() {
    this.model = null;
  }

  userOrEmailTypeaheadFn = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.emailAlreadyAdded = false;
      }),
      switchMap(searchTerm => {
        return this.search(searchTerm)
          .pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of({});
            })
          );
      })).pipe(tap(() => this.searching = false))
}
