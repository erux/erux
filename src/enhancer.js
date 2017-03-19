import { updateStatePathWithReducer } from './paths';
import { getActionMapping } from './actionMapping';

export default createStore =>
  (reducer, preloadedState, enhancer) => {
    const combinedReducer = (state, action) => {
      const actionMapping = getActionMapping(action.type);
      if (actionMapping) {
        const { path, reducer } = actionMapping;
        return updateStatePathWithReducer({
          state,
          path,
          reducer,
          action
        });
      }
      return reducer(state, action);
    };
    return createStore(combinedReducer, preloadedState, enhancer);
  };
