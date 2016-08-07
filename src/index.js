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

let reducedReducer = state => state;

const on = (type, reducer) => {
  checkTypeString(type);
  checkReducer(reducer);
  const nextReducer = (state, action) =>
    (action.type === type ? reducer(state, action) : state);
  reducedReducer = reduceReducers(nextReducer, reducedReducer);
};

const replaceReducer = reducer => { reducedReducer = reducer; };

const Erux = {
  on,
  reducer: (state, action) => reducedReducer(state, action),
  enhancer: createStore => (reducer, preloadedState, enhancer) => {
    checkReducer(reducer);
    const store = createStore(reducer, preloadedState, enhancer);
    const dispatch = action => {
      store.replaceReducer(reduceReducers(reducer, reducedReducer));
      store.dispatch(action);
      return action;
    };
    return {
      ...store,
      dispatch,
      on,
    };
  },
  replaceReducer,
};

export default Erux;
