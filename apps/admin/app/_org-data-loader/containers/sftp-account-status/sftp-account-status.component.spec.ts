import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SftpAccountStatusComponent } from './sftp-account-status.component';

describe('SftpAccountStatusComponent', () => {
  let component: SftpAccountStatusComponent;
  let fixture: ComponentFixture<SftpAccountStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SftpAccountStatusComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SftpAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show a spinner when LoadingLoaderSettings is true', () => {
    component.LoadingLoadersettings = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show Sftp information when LoadingLoaderSettings is false', () => {
    component.LoadingLoadersettings = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an active status if CompanyAutoloaderStatus is true', () => {
    component.LoadingLoadersettings = false;
    component.CompanyAutoloaderStatus = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an inactive status if CompanyAutoloaderStatus is false', () => {
    component.LoadingLoadersettings = false;
    component.CompanyAutoloaderStatus = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
