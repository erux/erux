import { initialState } from './';
import { updateStatePathWithReducer } from './paths';
import { actionFormat } from './actionsWithPathAndReducers';

// TODO: find a better way to do this!
// eslint-disable-next-line fp/no-let
let actionMappings = {};

// eslint-disable-next-line fp/no-mutation
export const clearActionMappings = () => actionMappings = {};
export const addActionMapping = ({ type, path, reducer }) =>
  // eslint-disable-next-line fp/no-mutation
  actionMappings[type] = [
    ...(actionMappings[type] || []).filter(mapping => mapping.path !== path),
    {
      path,
      reducer
    }
  ];
export const getActionMapping = type => actionMappings[type];
export const getInitialState = () =>
  (actionMappings[actionFormat(initialState)] || []).reduce((
    state,
    { path, reducer }
  ) =>
    updateStatePathWithReducer({
      state,
      path,
      reducer: () => reducer
    }), {});
