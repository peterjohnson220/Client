import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsImageControlComponent } from './trs-image-control.component';

describe('TrsImageControlComponent', () => {
  let component: TrsImageControlComponent;
  let fixture: ComponentFixture<TrsImageControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsImageControlComponent ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsImageControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.employee = { logoPath: 'path-to-logo' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the image src with the supplied value', () => {
    component.employee = { logoPath: 'path-to-logo' };
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src.includes('path-to-logo')).toBeTruthy();
  });
});
