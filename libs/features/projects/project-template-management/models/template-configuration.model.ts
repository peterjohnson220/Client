import { CompositeFieldHierarchy } from 'libs/models/projects/project-templates';

export interface ProjectTemplateConfiguration {
  [index: string]:  CategoryGroup;
}

export interface CategoryGroup {
  [index: string]: CompositeFieldHierarchy;
}

