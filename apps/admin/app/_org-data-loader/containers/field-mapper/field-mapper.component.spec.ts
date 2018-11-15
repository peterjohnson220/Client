import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FieldMapperComponent } from './field-mapper.component';

describe('FieldMapperComponent', () => {
  let component: FieldMapperComponent;
  let fixture: ComponentFixture<FieldMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldMapperComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable the Map button when a payfactors field AND client field have been selected', () => {
    component.selectedClientField = 'Job Code';
    component.selectedPfField = 'Job_Code';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable the Map button when a payfactors field OR client field have not been selected', () => {
    component.selectedClientField = 'Job Code';
    component.selectedPfField = '';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the Remove Mapping button when a mapping has been selected', () => {
    component.selectedMapping = 'Job_Code__Job Code';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable the Remove Mapping button when a mapping has NOT been selected', () => {
    component.selectedMapping = '';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should add a mapping to the list of mappings, ' +
    'and remove the fields from the Payfactors/CLient collections when ApplyMapping is called', () => {
    component.selectedPfField = 'Job_Code';
    component.selectedClientField = 'Job Code';
    component.clientFields = ['Job Code', 'Job Title'];
    component.payfactorsDataFields = ['Job_Code', 'Job_Title'];

    component.ApplyMapping();
    fixture.detectChanges();

    expect(component.mappedFields).toContain('Job_Code__Job Code');
    expect(component.clientFields).not.toContain('Job Code');
    expect(component.payfactorsDataFields).not.toContain('Job_Code');
  });

  it('should remove a mapping ' +
    'and add the fields back to the client/payfactors collections where RemoveMapping is called', () => {
    component.mappedFields = ['Job_Code__Job Code', 'Job_Title__Job Title'];
    component.clientFields = [];
    component.payfactorsDataFields = [];
    component.selectedMapping = 'Job_Code__Job Code';

    component.RemoveMapping();
    fixture.detectChanges();

    expect(component.mappedFields).not.toContain('Job_Code__Job Code');
    expect(component.clientFields).toContain('Job Code');
    expect(component.payfactorsDataFields).toContain('Job_Code');
  });

  it('should format a mapping with a caret for display instead of double underscores', () => {
    const field = 'Job_Code__Job Code';

    const result = component.formatMappingForDisplay(field);

    expect(result).toBe('Job_Code > Job Code');
  });

  it('should automatically map similar fields on a successful upload', () => {
    const evt = {response: {body: {value: ['Job Code', 'Job Title']}}};
    component.payfactorsDataFields = ['Job_Code', 'Job_Title'];
    component.successEventHandler(evt);

    fixture.detectChanges();

    expect(component.mappedFields).toContain('Job_Code__Job Code');
    expect(component.mappedFields).toContain('Job_Title__Job Title');
  });

  it('should reset the mappings on upload', () => {
    component.payfactorsDataFieldsForReset = ['Job_Code', 'Job_Title'];
    component.payfactorsDataFields = ['Job_Title'];
    component.mappedFields = ['Job_Code__Job Code'];

    component.uploadEventHandler({});

    expect(component.mappedFields).toEqual([]);
    expect(component.clientFields).toEqual([]);
    expect(component.payfactorsDataFields).toBe(component.payfactorsDataFieldsForReset);

  });

  it('should reset the mappings on removal of a file', () => {
    component.payfactorsDataFieldsForReset = ['Job_Code', 'Job_Title'];
    component.payfactorsDataFields = ['Job_Title'];
    component.mappedFields = ['Job_Code__Job Code'];

    component.removeEventHandler();

    expect(component.mappedFields).toEqual([]);
    expect(component.clientFields).toEqual([]);
    expect(component.payfactorsDataFields).toBe(component.payfactorsDataFieldsForReset);

  });
});
