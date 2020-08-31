import { isNullOrUndefined } from 'libs/core/functions/';
import { FilenamePattern } from 'libs/features/org-data-loader/models';
import { LoaderSetting } from 'libs/models/data-loads';

import { LoaderSettingsFilenamePatternOverrideKey, OrgDataFilenamePatternSetConvention } from '../constants';
import { OrgDataFilenamePatternSet } from '../models';

export class OrgDataFilenamePatternSetFactory {
  private readonly STARTS_WITH_PATTERN = '^';

  getConvention() {
    return OrgDataFilenamePatternSetConvention;
  }

  create(settings: LoaderSetting[]): OrgDataFilenamePatternSet {
    if (isNullOrUndefined(settings) || settings.length === 0) {
      return this.getConvention();
    }

    return {
      EmployeesFilenamePattern: this.getEmployeesFilenamePattern(settings),
      JobsFilenamePattern: this.getJobsFilenamePattern(settings),
      PayMarketsFilenamePattern: this.getPayMarketsFilenamePattern(settings),
      StructureMappingsFilenamePattern: this.getStructureMappingsFilenamePattern(settings),
      StructuresFilenamePattern: this.getStructuresFilenamePattern(settings),
      SubsidiariesFilenamePattern: this.getSubsidiariesFilenamePattern(settings),
      BenefitsFilenamePattern: this.getBenefitsFilenamePattern(settings)
    };
  }

  getEmployeesFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.Employees))
      || OrgDataFilenamePatternSetConvention.EmployeesFilenamePattern;
  }

  getJobsFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.Jobs))
      || OrgDataFilenamePatternSetConvention.JobsFilenamePattern;
  }

  getPayMarketsFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.PayMarkets))
      || OrgDataFilenamePatternSetConvention.PayMarketsFilenamePattern;
  }

  getStructureMappingsFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.StructureMapping))
      || OrgDataFilenamePatternSetConvention.StructureMappingsFilenamePattern;
  }

  getStructuresFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.Structures))
      || OrgDataFilenamePatternSetConvention.StructuresFilenamePattern;
  }

  getSubsidiariesFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.Subsidiaries))
      || OrgDataFilenamePatternSetConvention.SubsidiariesFilenamePattern;
  }

  getBenefitsFilenamePattern(settings: LoaderSetting[]): FilenamePattern {
    return this.getFilenamePattern(settings.find(s => s.KeyName === LoaderSettingsFilenamePatternOverrideKey.Benefits))
      || OrgDataFilenamePatternSetConvention.BenefitsFilenamePattern;
  }

  getFilenamePattern(setting: LoaderSetting): FilenamePattern {
    if (isNullOrUndefined(setting) || isNullOrUndefined(setting.KeyValue) || setting.KeyValue === '') {
      return null;
    }

    return {
      IsStartWithRestricted: this.isFilenamePatternStartWithRestricted(setting.KeyValue),
      Name: this.getFilenamePatternWithoutStartWithPattern(setting.KeyValue)
    };
  }

  isFilenamePatternStartWithRestricted(filenamePattern: string): boolean {
    return filenamePattern.startsWith(this.STARTS_WITH_PATTERN);
  }

  getFilenamePatternWithoutStartWithPattern(filenamePattern: string): string {
    if (this.isFilenamePatternStartWithRestricted(filenamePattern)) {
      return filenamePattern.substring(this.STARTS_WITH_PATTERN.length);
    }

    return filenamePattern;
  }
}
