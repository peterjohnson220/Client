import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { of, Subscription } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import { CompanyApiService } from '../../../data/payfactors-api/company';
import { UserApiService } from '../../../data/payfactors-api/user';
import { UserContext } from '../../../models/security';
import { RegexStrings } from '../../../constants';
import { PfConstants } from '../../../models/common';



@Component({
  selector: 'pf-user-or-email-picker',
  templateUrl: './user-or-email-picker.component.html',
  styleUrls: [ './user-or-email-picker.component.scss' ]
})

export class UserOrEmailPickerComponent implements OnInit, OnDestroy {
  @Input() companyId: number;
  @Input() nameToExclude: string;
  @Input() loaderType: string;
  @Input() jobId: number;
  @Input() workflow: boolean;
  @Output() selected = new EventEmitter();

  identity$: Observable<UserContext>;
  identitySubscription: Subscription;

  avatarUrl: string;
  model: any;
  searching = false;
  searchFailed = false;


  constructor(private companyApiService: CompanyApiService,
              private userApiService: UserApiService,
              private userContextStore: Store<fromRootState.State>) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(i => {
      if (i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
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
      this.selected.emit(payload);
    }
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return !this.workflow ? this.userApiService.getEmailRecipientsSearchResults(this.companyId, term, this.loaderType) : this.userApiService.picker(term)
      .map((results: any) => {
      let returnVal = [{}];

      if (results.length) {
        if (this.nameToExclude) {
          // filter out the user to exclude from this list (likely a current selected user)
          results = results.filter(r => (r.FirstName + ' ' + r.LastName) !== this.nameToExclude);
        }
        returnVal = results;
      } else {
        returnVal = RegExp(RegexStrings.EMAIL, 'i').test(term) ? [ { EmailAddress: term } ] : returnVal;
      }

      return returnVal;
    });
  }

  userOrEmailTypeaheadFn = (text$: Observable<string>) =>
    text$
      .debounceTime(PfConstants.DEBOUNCE_DELAY)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(searchTerm => {
        return this.search(searchTerm)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of({});
          });
      })
      .do(() => this.searching = false)
}
