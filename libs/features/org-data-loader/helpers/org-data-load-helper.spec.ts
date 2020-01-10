import { LoaderSetting } from 'libs/models/data-loads';

import { OrgDataLoadHelper } from './';

it('should parse and set response of LoaderSettingsSubscription', () => {

    const loaderSetting: LoaderSetting[] = [];
    loaderSetting.push({ LoaderSettingsId: 1, KeyName: 'Delimiter', KeyValue: '|' });
    loaderSetting.push({ LoaderSettingsId: 2, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' });

    const resp = OrgDataLoadHelper.parseSettingResponse(loaderSetting);

    expect(resp.delimiter).toBe('|');
    expect(resp.isEmployeesFullReplace).toBe(true);
});
