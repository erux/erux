[![build status](https://img.shields.io/travis/erux/erux/master.svg?style=flat-square)](https://travis-ci.org/erux/erux) 
[![npm version](https://img.shields.io/npm/v/erux.svg?style=flat-square)](https://www.npmjs.com/package/erux)
[![Coverage Status](https://coveralls.io/repos/github/erux/erux/badge.svg?branch=master)](https://coveralls.io/github/erux/erux?branch=master)

# eRux

This library enhances [Redux](https://github.com/reactjs/redux) either directly by adding the `store.on` function during Redux store creation or indirectly by calling `Erux.on` anywhere you have a reducer and using the reducer provided by `Erux.reducer` when creating your store. The two `on` functions allow for adding reducers in a fashion inspired by event-driven programming and also reducing the boilerplate by removing the ubiquitous `if` or `switch` statements from your reducer code to check if it should handle the given action type. A side benefit of all this is that adding a new reducer only needs to touch the new reducer code instead of also having to modify the reducer that your store is using.

## Install

```bash
npm install --save erux
```

You can also use a [browser friendly compiled file](https://npmcdn.com/erux@latest/dist/erux.js) from NPM CDN (mostly for online demo / snippets).


## Usage

### Reducer

If you are starting from scratch and don't have any legacy Redux code to integrate, the usage can be as simple as using our reducer when creating your store:
```js
// Define your reducer and attach it to an action type
// Can be in any source file
Erux.on(INC, state => state + 1);

// Create your store with initial state of 1
const store = createStore(Erux.reducer, 1);

// Dispatch action to the store
store.dispatch({ type: INC });
// store.getState() is now 2
```

### Enhancer

Or if you have some legacy code, you can attach the enhancer to the store instead:
```js
// Legacy reducer
const doubleReducer = (state, action) => {
  switch (action.type) {
    case DOUBLE:
      return state * 2
    default:
      return state
  }
}

// Create your store with legacy reducer and enhancer, result will have the on function
const enhancers = compose(applyMiddleware(logger), Erux.enhancer);
const store = createStore(doubleReducer, 0, enhancers);

// Add your reducers, feel free to put these anywhere it makes sense
// They are not coupled to the store creation at all
store.on(INC, state => state + 1);
store.on(DEC, state => state - 1);

// Dispatch some actions from elsewhere, UI perhaps?
store.dispatch({ type: INC }); // 2
store.dispatch({ type: DOUBLE }); // 4
store.dispatch({ type: DEC }); // 3
```
