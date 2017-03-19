import { addActionMapping } from './actionMapping';

const addUnderscoresBetween = (match, offset) => `${offset ? '_' : ''}${match}`;
const actionFormat = name =>
  name.replace(/[A-Z]/g, addUnderscoresBetween).toUpperCase();

export default ({ store: { dispatch }, path, actions }) =>
  actions &&
  Object.keys(actions).reduce(
    (actionCreators, functionName) => {
      const type = actionFormat(functionName);
      const reducer = actions[functionName];
      // eslint-disable-next-line fp/no-unused-expression
      addActionMapping({ type, path, reducer });
      return {
        ...actionCreators,
        [functionName]: action =>
          dispatch({
            type,
            ...action
          })
      };
    },
    {}
  );
