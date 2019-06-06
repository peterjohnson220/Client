import { LoaderSettingsFilenamePatternOverrideKey, OrgDataFilenamePatternSetConvention } from '../constants';
import { OrgDataFilenamePatternSetFactory } from '../helpers/org-data-filename-pattern-set-factory';
import { LoaderSetting, OrgDataFilenamePatternSet } from '../models';

describe('OrgDataFilenamePatternSetFactory', () => {
  let sut: OrgDataFilenamePatternSetFactory;

  beforeEach(() => {
    sut = new OrgDataFilenamePatternSetFactory();
  });

  describe('getConvenction function', () => {
    it('should return filename pattern convention', () => {
      let actualConvention = sut.getConvention();
      expect(actualConvention).toEqual(OrgDataFilenamePatternSetConvention);
    });
  });

  describe('create function', () => {
    it('should return convention if given null', () => {
      let actualConvention = sut.create(null);
      expect(actualConvention).toEqual(OrgDataFilenamePatternSetConvention);
    });

    it('should return convention if given undefined', () => {
      let actualConvention = sut.create(undefined);
      expect(actualConvention).toEqual(OrgDataFilenamePatternSetConvention);
    });

    it('should return convention if given empty array', () => {
      let actualConvention = sut.create(new Array<LoaderSetting>());
      expect(actualConvention).toEqual(OrgDataFilenamePatternSetConvention);
    });

    it('should return employee filename pattern override when setting is present', () => {
      const expectedPattern = "pattern!@#$";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 1,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.Employees,
        KeyValue: expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actualSet = sut.create(givenSettings);

      const expectedSet: OrgDataFilenamePatternSet = {
        ...OrgDataFilenamePatternSetConvention,
        EmployeesFilenamePattern: {
          IsStartWithRestricted: false,
          Name: expectedPattern,
        }
      };

      expect(actualSet).toEqual(expectedSet);
    });

    it('should return jobs filename pattern override when setting is present', () => {
      const expectedPattern = "it-is-a-pattern";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 2,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.Jobs,
        KeyValue: "^" + expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actualSet = sut.create(givenSettings);

      const expectedSet: OrgDataFilenamePatternSet = {
        ...OrgDataFilenamePatternSetConvention,
        JobsFilenamePattern: {
          IsStartWithRestricted: true,
          Name: expectedPattern,
        }
      };

      expect(actualSet).toEqual(expectedSet);
    });

    it('should return pay markets filename pattern override when setting is present', () => {
      const expectedPattern = "Hello, World!";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 3,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.PayMarkets,
        KeyValue: expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actualSet = sut.create(givenSettings);

      const expectedSet: OrgDataFilenamePatternSet = {
        ...OrgDataFilenamePatternSetConvention,
        PayMarketsFilenamePattern: {
          IsStartWithRestricted: false,
          Name: expectedPattern,
        }
      };

      expect(actualSet).toEqual(expectedSet);
    });

    it('should return structure mappings filename pattern override when setting is present', () => {
      const expectedPattern = "hey hey hey hey";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 4,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.StructureMapping,
        KeyValue: "^" + expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actualSet = sut.create(givenSettings);

      const expectedSet: OrgDataFilenamePatternSet = {
        ...OrgDataFilenamePatternSetConvention,
        StructureMappingsFilenamePattern: {
          IsStartWithRestricted: true,
          Name: expectedPattern,
        }
      };

      expect(actualSet).toEqual(expectedSet);
    });

    it('should return structures filename pattern override when setting is present', () => {
      const expectedPattern = "this is the song, la la la la";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 5,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.Structures,
        KeyValue: expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actualSet = sut.create(givenSettings);

      const expectedSet: OrgDataFilenamePatternSet = {
        ...OrgDataFilenamePatternSetConvention,
        StructuresFilenamePattern: {
          IsStartWithRestricted: false,
          Name: expectedPattern,
        }
      };

      expect(actualSet).toEqual(expectedSet);
    });

    it('should return pattern that is not start with restricted when override pattern does not begin with a caret', () => {
      const expectedPattern = "no-caret";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 6,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.StructureMapping,
        KeyValue: expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actual = sut.create(givenSettings);

      expect(actual.StructureMappingsFilenamePattern.IsStartWithRestricted).toEqual(false);
    });

    it('should return pattern that is start with restricted when override pattern begins with a caret', () => {
      const expectedPattern = "yes-caret";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 7,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.PayMarkets,
        KeyValue: "^" + expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actual = sut.create(givenSettings);

      expect(actual.PayMarketsFilenamePattern.IsStartWithRestricted).toEqual(true);
    });

    it('should return pattern without caret at start', () => {
      const expectedPattern = "paymarkets";
      const givenFilenamePatternOverrideSetting: LoaderSetting = {
        LoaderSettingsId: 7,
        KeyName: LoaderSettingsFilenamePatternOverrideKey.PayMarkets,
        KeyValue: "^" + expectedPattern
      };
      const givenSettings: Array<LoaderSetting> = [givenFilenamePatternOverrideSetting];

      let actual = sut.create(givenSettings);

      expect(actual.PayMarketsFilenamePattern.Name).toEqual(expectedPattern);
    });
  });
});