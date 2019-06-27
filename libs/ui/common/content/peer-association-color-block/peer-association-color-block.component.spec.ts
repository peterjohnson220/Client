import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';

import { PeerAssociationColorBlockComponent } from './peer-association-color-block.component';

describe('AssociationColorBlockComponent', () => {
  let component: PeerAssociationColorBlockComponent;
  let fixture: ComponentFixture<PeerAssociationColorBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeerAssociationColorBlockComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerAssociationColorBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the pending css class when the association is pending', () => {
    // arrange
    component.isPendingPeerUserReview = true;

    // act, assert
    expect(component.getAssociationClass()).toBe('pending');
  });

  it('should return the associated css class when the association is not pending', () => {
    // arrange
    component.isAssociated = true;

    // act, assert
    expect(component.getAssociationClass()).toBe('associated');
  });

  it('should return the associated css class for unsaved associations', () => {
    // arrange
    component.companyJobId = 123;
    const companyJobs = [{ CompanyJobId: 123 }] as CompanyJob[];
    component.unsavedExchangeJobAssociations = [{ CompanyJobs: companyJobs, ExchangeId: 25, ExchangeJobId: 18465 }];

    // act, assert
    expect(component.getAssociationClass()).toBe('associated');
  });

  it('should return the not-associated css class when there are no matching unsaved associations', () => {
    // arrange
    component.companyJobId = 123;
    const companyJobs = [{ CompanyJobId: 456 }] as CompanyJob[];
    component.unsavedExchangeJobAssociations = [{ CompanyJobs: companyJobs, ExchangeId: 25, ExchangeJobId: 18465 }];

    // act, assert
    expect(component.getAssociationClass()).toBe('not-associated');
  });
});
