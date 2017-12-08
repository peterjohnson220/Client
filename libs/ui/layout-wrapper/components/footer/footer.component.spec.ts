import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer.component';

describe('footer', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let instance: FooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FooterComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FooterComponent);
    instance = fixture.componentInstance;
  });

  it('should show correct copyright information', () => {
    const de = fixture.debugElement.query(By.css('span'));
    const el = de.nativeElement;
    expect(el.innerHTML).toBe(`© ${(new Date()).getFullYear()} Payfactors All rights reserved.`);
  });

});
