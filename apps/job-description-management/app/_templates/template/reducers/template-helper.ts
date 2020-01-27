import { TemplateControl } from 'libs/models';

export const addControlToSection = (sections: any, templateControl, index) => {
    return sections.map(section => {
        if (section.Id === parseInt(templateControl.SectionId, 10)) {
        section.Controls.splice(index || section.Controls.length, 0, templateControl);
        }
        return section;
    });
};

export const deleteControlFromSection = (sections: any, templateControl) => {
    return sections.map(section => {
        if (section.Id === parseInt(templateControl.SectionId, 10)) {
        section.Controls = section.Controls.filter(control => control.Id !== templateControl.Id);
        }
        return section;
    });
};

export const getControl = (sections: any, templateControl): TemplateControl => {
    return sections
        .find(s => s.Id === parseInt(templateControl.SectionId, 10)).Controls
        .find(c => c.Id === parseInt(templateControl.Id, 10));
};

export const getDataRow = (sections: any, templateControl, dataRowId) => {
    return getControl(sections, templateControl).Data.find(d => d.Id === dataRowId);
};
