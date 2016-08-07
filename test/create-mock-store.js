export default function createMockStore(reducer, preloadedState, enhancer) {
  // Missing handling from Redux source
  // To support passing enhancer without a preloaded state
  if (enhancer) {
    // We have an enhancer, get the store from it instead
    // But with no enhancer passed to it
    return enhancer(createMockStore)(reducer, preloadedState);
  }

  // No enhancer, just create the store
  let storeReducer = reducer;
  let storeState = preloadedState;

  // Supports all external API except for subscribe and $$observable
  // Which are not needed for any existing tests
  return {
    getState: () => storeState,
    dispatch: action => {
      storeState = storeReducer(storeState, action);
      return action;
    },
    replaceReducer: newReducer => {
      storeReducer = newReducer;
    },
  };
}
