import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CompanySelectorComponent } from './company-selector.component';

describe('CompanySelectorComponent', () => {
  let component: CompanySelectorComponent;
  let fixture: ComponentFixture<CompanySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ CompanySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner when Companies are loading', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a dropdown with companies when Companies are done loading', () => {
    component.loading = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
