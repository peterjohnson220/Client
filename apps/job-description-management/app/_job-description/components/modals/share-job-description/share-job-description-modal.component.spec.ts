import { JobDescriptionSharingService } from '../../../services/job-description-sharing.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedJobDescription } from '../../../models';
import { Observable, Subscriber } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShareJobDescriptionModalComponent } from './share-job-description-modal.component';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: ShareJobDescriptionModalComponent;
  let fixture: ComponentFixture<ShareJobDescriptionModalComponent>;
  let modal: NgbModal;
  let jobSharingService: JobDescriptionSharingService;
  let subscriber: Subscriber<any>;
  let store: Store<fromAppNotificationsMainReducer.State>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [
        ShareJobDescriptionModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn() }
        },
        {
          provide: JobDescriptionSharingService,
          useValue: {
            sendEmails: _ => new Observable(s => { subscriber = s }),
            init: () => {},
            destroy: () => {}
          }
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ShareJobDescriptionModalComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();

    instance.addNonPfUserForm = new FormGroup({});

    modal = TestBed.inject(NgbModal);
    jobSharingService = TestBed.inject(JobDescriptionSharingService);
  });

  it('should reset component variables and open the modal, when calling open', () => {
    jest.spyOn(instance.addNonPfUserForm, 'reset');
    jest.spyOn(modal, 'open');

    instance.shareJobDescriptionModal = {};

    instance.open();

    expect(instance.addNonPfUserForm.reset).toHaveBeenCalled();
    expect(modal.open).toHaveBeenCalled();
  });

  it('should call sendEmails API when shareEmailList() is called', () => {
    jest.spyOn(jobSharingService, 'sendEmails');
    let jobDescs = new Map();
    jobDescs.set(288290, {});
    instance.selectedJobDescriptions = jobDescs;
    instance.emailList = [{
      FirstName: 'Harry',
      LastName: 'Potter',
      EmailAddress: 'harrypotter@hogwarts.com'
    }]
    instance.shareEmailList();
    expect(jobSharingService.sendEmails).toBeCalled();
    
  });

  it('should reset emailList back to empty on modal close', () => {
    instance.shareJobDescriptionModal = {};
    instance.open();
    instance.emailList = [{
      FirstName: 'Harry',
      LastName: 'Potter',
      EmailAddress: 'harrypotter@hogwarts.com'
    }]
    expect(instance.emailList.length).toBe(1);
    instance.close();
    expect(instance.emailList).toEqual([]);
  });

  it('should add nonPfUser email to emailList if email is valid', () => {
    instance.shareJobDescriptionModal = {};
    instance.open();
    instance.emailList = [{
      FirstName: '',
      LastName: '',
      EmailAddress: 'harrypotter@hogwarts.com'
    }];
    instance.addNonPfUserForm.value.firstname = 'Harry';
    instance.addNonPfUserForm.value.lastname = 'Potter';
    instance.currentEmail = {
      FirstName: '',
      LastName: '',
      EmailAddress: 'harrypotter@hogwarts.com'
    };
    expect(instance.emailList[0].FirstName).toBe('');
    instance.nonPfUserFormSubmit();
    expect(instance.emailList[0].FirstName).toBe('Harry');
  });

  it('should remove nonPfUser if user cancels the name form', () => {
    instance.shareJobDescriptionModal = {};
    instance.open();
    instance.emailList = [{
      FirstName: '',
      LastName: '',
      EmailAddress: 'harrypotter@hogwarts.com'
    }];
    instance.currentEmail = {
      FirstName: '',
      LastName: '',
      EmailAddress: 'harrypotter@hogwarts.com'
    };
    expect(instance.emailList.length).toBe(1);
    instance.cancelNonPfUserAdd();
    expect(instance.emailList.length).toBe(0);
  });

});
