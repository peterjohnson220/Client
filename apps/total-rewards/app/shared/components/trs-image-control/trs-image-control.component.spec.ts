import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsImageControlComponent } from './trs-image-control.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { generateMockImageControl, StatementModeEnum } from '../../models';

describe('TrsImageControlComponent', () => {
  let component: TrsImageControlComponent;
  let fixture: ComponentFixture<TrsImageControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsImageControlComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsImageControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.controlData = generateMockImageControl();
    component.mode = StatementModeEnum.Edit;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the image src with the supplied value', () => {
    component.controlData = generateMockImageControl();
    component.mode = StatementModeEnum.Edit;
    component.controlData.FileName = 'example.png';
    component.controlData.FileUrl = 'www.exampledomain.com/example.png';

    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img.src.includes('www.exampledomain.com/example.png')).toBeTruthy();
  });

  it('should display error message upon server error', () => {
    component.controlData = generateMockImageControl();
    component.mode = StatementModeEnum.Edit;
    component.isServerError = true;

    fixture.detectChanges();

    const error = fixture.debugElement.nativeElement.querySelector('.server-error');
    expect(error.textContent).toEqual('An error occurred');
  });
});
