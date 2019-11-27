import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { generateMockUserManagementDto } from 'libs/models/payfactors-api/user';
import { PfFormsModule } from 'libs/forms';
import { UserApiService } from 'libs/data/payfactors-api';
import { of } from 'rxjs';

class MockUserService extends UserApiService {
  emailExists() {
    return of(false);
  }
}

describe('Admin - Company Admin - User Component', () => {
  let instance: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockUser = generateMockUserManagementDto();
  const mockUserService = new MockUserService(null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PfFormsModule
      ],
      providers: [
        {
          provide: UserApiService, userValue: mockUserService
        }
      ],
      declarations: [
        UserFormComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should display form', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should populate user form with mock data', fakeAsync(() => {
    fixture.detectChanges();
    instance._user = mockUser;
    tick();
    expect(instance.user).toBe(mockUser);
  }));

  it('Form should be valid', fakeAsync(() => {

    fixture.detectChanges();
    const form = instance.userForm;

    expect(form.valid).toEqual(false);

    const tooLongValue = Array(300).fill('a').join();

    // FirstName
    expect(form.get('firstName').valid).toEqual(false);
    form.get('firstName').setValue(tooLongValue);
    expect(form.get('firstName').valid).toEqual(false);
    form.get('firstName').setValue(mockUser.FirstName);
    expect(form.get('firstName').valid).toEqual(true);

    // LastName
    expect(form.get('lastName').valid).toEqual(false);
    form.get('lastName').setValue(tooLongValue);
    expect(form.get('lastName').valid).toEqual(false);
    form.get('lastName').setValue(mockUser.LastName);
    expect(form.get('lastName').valid).toEqual(true);

    // Title
    form.get('title').setValue(tooLongValue);
    expect(form.get('title').valid).toEqual(false);
    form.get('title').setValue(mockUser.Title);
    expect(form.get('title').valid).toEqual(true);

    // Phone
    form.get('phoneNumber').setValue(tooLongValue);
    expect(form.get('phoneNumber').valid).toEqual(false);
    form.get('phoneNumber').setValue(mockUser.PhoneNumber);
    expect(form.get('phoneNumber').valid).toEqual(true);

    // Email
    expect(form.get('emailAddress').valid).toEqual(false);
    form.get('emailAddress').setValue(tooLongValue);
    expect(form.get('emailAddress').valid).toEqual(false);
    form.get('emailAddress').setValue('test@j');
    expect(form.get('emailAddress').valid).toEqual(false);
    form.controls['emailAddress'].clearAsyncValidators();
    form.get('emailAddress').setValue(mockUser.EmailAddress);
    expect(form.get('emailAddress').valid).toEqual(true);

    // Password
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue('pas');
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue(tooLongValue);
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue(mockUser.Password);
    expect(form.get('password').valid).toEqual(true);

    instance.setPasswordValidator(false);

    form.get('password').setValue('');
    form.get('status').setValue(false);
    expect(form.get('password').valid).toEqual(true);

    expect(form.valid).toEqual(true);
  }));

});


