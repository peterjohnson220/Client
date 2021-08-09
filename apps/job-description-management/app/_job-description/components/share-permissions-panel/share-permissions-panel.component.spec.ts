import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subscriber } from 'rxjs';
import { SharedJobDescription } from '../../models';

import { SharePermissionsPanelComponent } from './share-permissions-panel.component';

describe('SharePermissionsPanelComponent', () => {
  let component: SharePermissionsPanelComponent;
  let fixture: ComponentFixture<SharePermissionsPanelComponent>;
  let subscriber: Subscriber<SharedJobDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharePermissionsPanelComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA /* needed so use of fa-icon doesn't cause errors */]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePermissionsPanelComponent);
    component = fixture.componentInstance;
    component.getShares = new Observable(s => { subscriber = s; });
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
    subscriber.next({
      SharedTo: { EmailAddress: 'ketchup@ketchup.com', FirstName: '', LastName: '' },
      SharedBy: 'mustard@mustard.com',
      SharedDate: new Date('1/7/2021')
    });
    subscriber.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Job description has not yet been shared.');
    expect(fixture.nativeElement.textContent).not.toContain('Error Loading Share Permissions');
    expect(fixture.nativeElement.textContent).toContain('ketchup@ketchup.com');
    expect(fixture.nativeElement.textContent).toContain('Shared by mustard@mustard.com');
  });

  it('should trigger close event when close button clicked', () => {
    spyOn(component.onClose, 'emit');
    fixture.nativeElement.querySelector('.pf-share-permissions-panel__close').click();

    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should trigger share event when Share button clicked', () => {
    spyOn(component.onShare, 'emit');
    fixture.nativeElement.querySelector('.pf-share-permissions-panel__share-button').click();

    expect(component.onShare.emit).toHaveBeenCalled();
  });
});
