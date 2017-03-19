import { spy } from 'sinon';

export default function createMockStore(reducer, preloadedState, enhancer) {
  // eslint-disable-next-line fp/no-let
  let storeState = preloadedState;
  return enhancer
    ? enhancer(createMockStore)(reducer, preloadedState)
    : {
        getState: () => storeState,
        dispatch: spy(action => {
          // eslint-disable-next-line fp/no-mutation
          storeState = reducer(storeState, action);
          return action;
        }),
        // helper for clearing state before test runs, non functional :(
        clearState() {
          // eslint-disable-next-line fp/no-mutation
          storeState = undefined;
        }
      };
}
