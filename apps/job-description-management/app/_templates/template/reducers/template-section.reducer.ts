import cloneDeep from 'lodash/cloneDeep';

import { TemplateSection } from 'libs/models/jdm/template';
import { arrayMove } from 'libs/core/functions';

import * as fromTemplateActions from '../actions';

export const reducer = (state, action) => {
  switch (action.type) {
    case fromTemplateActions.ADD_SECTION: {
      const templateSection: TemplateSection = action.payload.templateSection;
      const newState = cloneDeep(state);
      newState.template.Sections.push(templateSection);

      return newState;
    }
    case fromTemplateActions.EDIT_SECTION: {
      const templateSection: TemplateSection = action.payload.templateSection;
      const newState = cloneDeep(state);

      newState.template.Sections = state.template.Sections.map(section => {
        return section.Id === templateSection.Id ? templateSection : section;
      });

      return newState;
    }
    case fromTemplateActions.DELETE_SECTION: {
      const templateSection: TemplateSection = action.payload.templateSection;
      const newState = cloneDeep(state);
      newState.template.Sections = newState.template.Sections.filter(section => section.Id !== templateSection.Id);

      return newState;
    }
    case fromTemplateActions.MOVE_SECTION: {
          const newState = cloneDeep(state);
          newState.template.Sections = arrayMove(newState.template.Sections, action.payload.oldIndex, action.payload.newIndex);
      return newState;
    }
    default:
      return state;
  }
};
