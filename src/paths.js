const indexOfDot = path => path && path.indexOf('.');
const hasDot = path => indexOfDot(path) > 0;

export const nextPart = path =>
  hasDot(path) ? path.substring(0, indexOfDot(path)) : path;
export const remainingPart = path =>
  hasDot(path) ? path.substring(indexOfDot(path) + 1) : '';

export const updateStatePathWithReducer = (
  { state = {}, path, reducer = state => state, action = {} }
) =>
  path
    ? {
        ...state,
        [nextPart(path)]: updateStatePathWithReducer({
          state: state[nextPart(path)],
          path: remainingPart(path),
          reducer,
          action
        })
      }
    : reducer(state, action);
