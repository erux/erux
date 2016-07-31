import reduceReducers from 'reduce-reducers';

const checkReducer = reducer => {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }
};

const checkTypeString = type => {
  if (!type || typeof type !== 'string') {
    throw new Error('Type is required and must be a >0 length string.');
  }
};

let reducedReducer;

const on = (type, reducer) => {
  checkTypeString(type);
  checkReducer(reducer);
  const nextReducer = (state, action) =>
    (action.type === type ? reducer(state, action) : state);
  reducedReducer = reducedReducer
    ? reduceReducers(nextReducer, reducedReducer) : nextReducer;
};

let enhancerOn = false;
const Erux = {
  on,
  reducer: (state, action) => {
    if (enhancerOn) {
      throw new Error("Already using enhancer, can't also use reducer.");
    }
    checkReducer(reducedReducer);
    return reducedReducer(state, action);
  },
  enhancer: createStore => (reducer, preloadedState, enhancer) => {
    checkReducer(reducer);
    const store = createStore(reducer, preloadedState, enhancer);
    const dispatch = action => {
      if (reducedReducer) {
        store.replaceReducer(reduceReducers(reducer, reducedReducer));
      }
      store.dispatch(action);
    };
    enhancerOn = true;
    return {
      ...store,
      dispatch,
      on,
    };
  },
};

export default Erux;
