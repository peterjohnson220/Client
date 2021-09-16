import { JobDescriptionSharingService } from './../../services/job-description-sharing.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subscriber } from 'rxjs';
import { SharedJobDescriptionUser } from '../../models';

import { SharePermissionsPanelComponent } from './share-permissions-panel.component';

describe('SharePermissionsPanelComponent', () => {
  let component: SharePermissionsPanelComponent;
  let fixture: ComponentFixture<SharePermissionsPanelComponent>;
  let subscriber: Subscriber<SharedJobDescriptionUser[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharePermissionsPanelComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA /* needed so use of fa-icon doesn't cause errors */],
      providers: [{
        provide: JobDescriptionSharingService,
        useValue: {
          getSharedUsers: _ => new Observable(s => { subscriber = s; }),
          init: () => {},
          destroy: () => {}
        }
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePermissionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show loading message at first', () => {
    expect(fixture.nativeElement.textContent).toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Job description has not yet been shared.');
  });

  it('should show empty message if no shares', () => {
    subscriber.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).toContain('Job description has not yet been shared.');
  });

  it('should show error message if error', () => {
    subscriber.error('oops');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Job description has not yet been shared.');
    expect(fixture.nativeElement.textContent).toContain('Error Loading Share Permissions');
  });

  it('should show share details', () => {
    subscriber.next([{
      EmailAddress: 'ketchup@ketchup.com',
      FirstName: 'Ketchup',
      LastName: 'Face',
      SharedByEmail: 'mustard@mustard.com',
      SharedByFirstName: 'Mustard',
      SharedByLastName: 'Pie',
      ShareDate: new Date('1/7/2021')
    }]);
    subscriber.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Job description has not yet been shared.');
    expect(fixture.nativeElement.textContent).not.toContain('Error Loading Share Permissions');
    expect(fixture.nativeElement.textContent).toContain('Ketchup Face');
    expect(fixture.nativeElement.textContent).toContain('Shared by Mustard Pie');
  });

  it('should show emails if names not available', () => {
    subscriber.next([{
      EmailAddress: 'ketchup@ketchup.com',
      FirstName: null,
      LastName: null,
      SharedByEmail: 'mustard@mustard.com',
      SharedByFirstName: null,
      SharedByLastName: null,
      ShareDate: new Date('1/7/2021')
    }]);
    subscriber.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('ketchup@ketchup.com');
    expect(fixture.nativeElement.textContent).toContain('Shared by mustard@mustard.com');
  });

  it('should trigger close event when close button clicked', () => {
    jest.spyOn(component.onClose, 'emit');
    fixture.nativeElement.querySelector('.pf-share-permissions-panel__close').click();

    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should trigger share event when Share button clicked', () => {
    jest.spyOn(component.onShare, 'emit');
    fixture.nativeElement.querySelector('.pf-share-permissions-panel__share-button').click();

    expect(component.onShare.emit).toHaveBeenCalled();
  });
});
