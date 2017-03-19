import { addActionMapping } from './actionMapping';

const addUnderscoresBetween = (match, offset) => `${offset ? '_' : ''}${match}`;
const actionFormat = name =>
  name.replace(/[A-Z]/g, addUnderscoresBetween).toUpperCase();

export default ({ path, reducers = {} }) =>
  Object.keys(reducers).reduce(
    (actionCreators, functionName) => {
      const type = actionFormat(functionName);
      const reducer = reducers[functionName];
      // eslint-disable-next-line fp/no-unused-expression
      addActionMapping({ type, path, reducer });
      return {
        ...actionCreators,
        [functionName]: action => ({
          ...action,
          type
        })
      };
    },
    {}
  );
