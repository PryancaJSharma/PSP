import { FormikProps } from 'formik';
import { Api_Project } from 'models/api/Project';
import React from 'react';

import AddProjectForm from './add/AddProjectForm';
import ProjectTabsContainer from './detail/ProjectTabsContainer';
import { ProjectContainerState, ProjectPageNames } from './ProjectContainer';
import { ProjectTabNames } from './ProjectTabs';
import UpdateProjectContainer from './update/UpdateProjectContainer';

export interface IViewSelectorProps {
  project?: Api_Project;
  isEditing: boolean;
  setContainerState: (value: Partial<ProjectContainerState>) => void;
  setProject: (project: Api_Project) => void;
  activeTab?: ProjectTabNames;
  activeEditForm?: ProjectPageNames;
  onSuccess: () => void;
}

export const ViewSelector = React.forwardRef<FormikProps<any>, IViewSelectorProps>(
  (props, formikRef) => {
    if (props.isEditing && !!props.project) {
      return (
        <UpdateProjectContainer
          ref={formikRef}
          project={props.project}
          View={AddProjectForm}
          onSuccess={props.onSuccess}
        />
      );
    }

    // render read-only views
    return (
      <ProjectTabsContainer
        project={props.project}
        setProject={props.setProject}
        setContainerState={props.setContainerState}
        activeTab={props.activeTab}
      />
    );
  },
);

export default ViewSelector;
