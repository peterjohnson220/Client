import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { LoaderType } from 'libs/features/org-data-loader/constants';

import { FieldMapperComponent } from './field-mapper.component';
import { LoaderEntityStatus } from '../../models';

describe('FieldMapperComponent', () => {
  let component: FieldMapperComponent;
  let fixture: ComponentFixture<FieldMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FieldMapperComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMapperComponent);
    component = fixture.componentInstance;
    component.loaderType = LoaderType.Structures;
    component.visibleLoaderOptions = {
      clientFileName: true,
      selectFile: true
    };
    component.customFields$ = of ({companyId: 1, customFields: [{Key: 'test', Value: '1'}], entity: LoaderType.Jobs});
    component.fieldMappings$ = of([{
      CompanyId: 13,
      LoaderType: LoaderType.Jobs,
      LoaderFieldMappings: [{
        InternalField: 'Job_Code',
        ClientField: 'JobCode'
      },
      {
        InternalField: 'Job_Title',
        ClientField: 'JobTitle'
      }]
    },
    {
      CompanyId: 13,
      LoaderType: LoaderType.Employees,
      LoaderFieldMappings: [{
        InternalField: 'Employee_Id',
        ClientField: 'EmpId'
      },
      {
        InternalField: 'Job_Code',
        ClientField: 'JobCode',
      },
      {
        InternalField: 'PayMarket',
        ClientField: 'PayMarket'
      }]
    }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner when the company\'s mappings are being retrieved', () => {
    component.fieldMappingsLoading = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
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

  it('should show a date format selector when the loader type is Employees', () => {
    component.loaderType = LoaderType.Employees;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a add/full replace toggle when the loader type is Employees', () => {
    component.loaderType = LoaderType.Employees;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a add/full replace toggle when the loader type is Structure Mappings', () => {
    component.loaderType = LoaderType.StructureMapping;
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
    const evt = { response: { body: { value: ['Job Code', 'Job Title'] } } };
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

  it('should populate the mappings box with the company\'s existing mappings on init', () => {
    component.loaderType = LoaderType.Jobs;
    component.payfactorsDataFields = ['Job_Code', 'Job_Title'];

    const expectedMappings = ['Job_Code__JobCode', 'Job_Title__JobTitle'];
    component.ngOnInit();

    fixture.detectChanges();

    expect(component.mappedFields).toEqual(expectedMappings);
  });

  describe('Filename Pattern', () => {
    it('should read "begin with" if the pattern is start restricted', () => {
      component.filenamePattern = {
        IsStartWithRestricted: true,
        Name: 'paymarkets_pf'
      };

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });

    it('should read "contain" if the pattern is not start restricted', () => {
      component.filenamePattern = {
        IsStartWithRestricted: false,
        Name: 'employees_123'
      };

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });

    it('should display the filename pattern', () => {
      component.filenamePattern = {
        IsStartWithRestricted: true,
        Name: 'this-is-my-filename-pattern'
      };

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });
  });

  describe('mappingComplete LoaderEntityStatus payload', () => {
    it('should include Employees settings when mapping is complete', () => {
      // arrange
      const dateFormat = 'yyyy-MM-dd';
      const isFullReplace = false;
      const loaderType = LoaderType.Employees;
      const mappings = ['some field'];
      component.clientFields = [];
      component.dateFormat = dateFormat;
      component.loaderType = loaderType;
      component.mappedFields = mappings;
      component.isFullReplace = true;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: true,
        dateFormat,
        isFullReplace,
        loadEnabled: true,
        loaderType,
        mappings,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.changeIsFullReplace(isFullReplace);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should include Employees settings when mapping is not complete', () => {
      // arrange
      const dateFormat = 'yyyy-MM-dd';
      const isFullReplace = false;
      const loaderType = LoaderType.Employees;
      component.clientFields = ['some field'];
      component.dateFormat = dateFormat;
      component.loaderType = loaderType;
      component.isFullReplace = true;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: false,
        dateFormat,
        isFullReplace,
        loadEnabled: true,
        loaderType,
        mappings: null,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.changeIsFullReplace(isFullReplace);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should include StructureMapping settings when mapping is complete', () => {
      // arrange
      const isFullReplace = false;
      const loaderType = LoaderType.StructureMapping;
      const mappings = ['some field'];
      component.clientFields = [];
      component.loaderType = loaderType;
      component.mappedFields = mappings;
      component.isFullReplace = true;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: true,
        dateFormat: undefined,
        isFullReplace,
        loadEnabled: true,
        loaderType,
        mappings,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.changeIsFullReplace(isFullReplace);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should include StructureMapping settings when mapping is not complete', () => {
      // arrange
      const isFullReplace = false;
      const loaderType = LoaderType.StructureMapping;
      component.clientFields = ['some field'];
      component.loaderType = loaderType;
      component.isFullReplace = true;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: false,
        dateFormat: undefined,
        isFullReplace,
        loadEnabled: true,
        loaderType,
        mappings: null,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.changeIsFullReplace(isFullReplace);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should not include settings for entities without settings when mapping is complete', () => {
      // arrange
      const loaderType = LoaderType.Structures;
      const mappings = ['some field'];
      component.clientFields = [];
      component.loaderType = loaderType;
      component.mappedFields = mappings;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: true,
        dateFormat: undefined,
        isFullReplace: undefined,
        loadEnabled: true,
        loaderType,
        mappings,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.selectionChange(null);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should not include settings for entities without settings when mapping is not complete', () => {
      // arrange
      const loaderType = LoaderType.Structures;
      component.clientFields = ['some field'];
      component.loaderType = loaderType;
      const next = jest.fn();
      const expectedPayload: LoaderEntityStatus = {
        complete: false,
        dateFormat: undefined,
        isFullReplace: undefined,
        loadEnabled: true,
        loaderType,
        mappings: null,
      };

      component.mappingComplete.subscribe({ next });

      fixture.detectChanges();

      // act
      component.selectionChange(null);

      // assert
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(expectedPayload);
    });

    it('should clear out any existing mappings and add new mappings on refresh', () => {
      component.loaderType = LoaderType.Structures;
      component.payfactorsDataFields = [];
      component.clientFields = [];
      component.mappedFields = ['ExistingMapping__ThatWasPreviouslyMapped', 'Another__OldMapping'];

      component.fieldMappings$ = of([{
        CompanyId: 13,
        LoaderType: LoaderType.Structures,
        LoaderFieldMappings: [{
          InternalField: 'GradeCode',
          ClientField: 'Grade'
        },
        {
          InternalField: 'Min',
          ClientField: 'Minimum'
        }]
      }]);
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.mappedFields).toEqual(['GradeCode__Grade', 'Min__Minimum']);
    });
  });
});
