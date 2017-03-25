// eslint-disable-next-line fp/no-let
let actionMappings = {};

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
