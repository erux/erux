import { assert } from 'chai';
import Erux from '../src';
import createMockStore from './create-mock-store';

describe('Erux', () => {
  const reducerError = 'reducer to be a function';
  const { reducer, enhancer, on, replaceReducer } = Erux;
  before(() => {
    // Before replacing reducer, make sure the default one functions properly
    const initialState = {};
    assert.strictEqual(reducer(initialState, {}), initialState);
  });
  beforeEach(() => {
    replaceReducer(state => state);
  });
  describe('reducer function to get a reducer', () => {
    it('should be a function', () => {
      assert.isFunction(reducer);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(reducer.length, 2);
    });
    it('should return identical state without any reducers', () => {
      const initialState = {};
      assert.strictEqual(reducer(initialState, {}), initialState);
    });
  });

  describe('enhancer function to get an enhancer', () => {
    it('should be a function', () => {
      assert.isFunction(enhancer);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(enhancer.length, 1);
    });
    it('should return a function', () => {
      assert.isFunction(enhancer());
    });
    it('should return a function taking the correct number of arguments', () => {
      assert.strictEqual(enhancer().length, 3);
    });
    it('should fail without proper reducer', () => {
      assert.throws(enhancer(), reducerError);
      assert.throws(() => enhancer()(''), reducerError);
      assert.throws(() => enhancer()([]), reducerError);
      assert.throws(() => enhancer()({}), reducerError);
    });
  });

  describe('on function to add a reducer for an action type', () => {
    it('should be a function', () => {
      assert.isFunction(on);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(on.length, 2);
    });
    it('should fail without type', () => {
      const typeError = 'Type is required';
      assert.throws(on, typeError);
      assert.throws(() => on(''), typeError);
      assert.throws(() => on([]), typeError);
      assert.throws(() => on({}), typeError);
      assert.throws(() => on(x => x), typeError);
    });
    it('should fail without reducer', () => {
      assert.throws(() => on(' '), reducerError);
      assert.throws(() => on(' ', ''), reducerError);
      assert.throws(() => on(' ', []), reducerError);
      assert.throws(() => on(' ', {}), reducerError);
    });
    describe('when called with a simple number reducer', () => {
      const PLUS_ONE = 'PLUS_ONE';
      beforeEach(() => {
        on(PLUS_ONE, state => state + 1);
      });
      it('should result in a correct reducer being available', () => {
        assert.strictEqual(reducer(0, { type: PLUS_ONE }), 1);
        assert.strictEqual(reducer(99, { type: PLUS_ONE }), 100);
        assert.strictEqual(reducer(0, { type: 'WRONG_TYPE' }), 0);
      });
      it('should result in a correct enhancer being available', () => {
        const store = createMockStore(state => state, 0, enhancer);
        store.dispatch({ type: PLUS_ONE });
        assert.strictEqual(store.getState(), 1);
      });
    });
    describe('when called with a simple string reducer', () => {
      const CONCAT = 'CONCAT';
      beforeEach(() => {
        on(CONCAT, state => state.concat('cat'));
      });
      it('should result in a correct reducer being available', () => {
        assert.strictEqual(reducer('', { type: CONCAT }), 'cat');
        assert.strictEqual(reducer('bob', { type: CONCAT }), 'bobcat');
        assert.strictEqual(reducer('', { type: 'WRONG_TYPE' }), '');
      });
      it('should result in a correct enhancer being available', () => {
        const store = createMockStore(state => state, 'con', enhancer);
        store.dispatch({ type: CONCAT });
        assert.strictEqual(store.getState(), 'concat');
      });
    });
    describe('when called with a simple object reducer', () => {
      const LOAD = 'LOAD';
      const pageToLoad = 'somePage.html';
      const loadReducer = (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        request: action.pageToLoad,
      });
      const initialState = { loading: true };
      const loadAction = { type: LOAD, pageToLoad };
      const expectedState = {
        loading: false,
        loaded: true,
        request: pageToLoad,
      };
      beforeEach(() => {
        on(LOAD, loadReducer);
      });
      it('should result in a correct reducer being available', () => {
        const reducedState = reducer(initialState, loadAction);
        assert.deepEqual(reducedState, expectedState);
      });
      it('should result in a correct enhancer being available', () => {
        const store = createMockStore(state => state, initialState, enhancer);
        store.dispatch(loadAction);
        assert.deepEqual(store.getState(), expectedState);
      });
    });
  });

  describe('when used to create a store', () => {
    // Helpers to add concat reducers
    const letterReducer = letter => state => state.concat(letter);
    const onFactory = obj => letter => obj.on(letter, letterReducer(letter));
    const onLetterReducer = onFactory({ on });
    it('with reducer should call reducers added anytime before they are dispatched', () => {
      // Add reducer before creating store
      onLetterReducer('A');
      // Create store
      const store = createMockStore(reducer, '');
      // Add reducers after creating store but before dispatch
      onLetterReducer('B');
      // Dispatch some actions
      store.dispatch({ type: 'A' });
      store.dispatch({ type: 'B' });
      // Add reducers after creating store and dispatch
      onLetterReducer('C');
      // Dispatch to remaining reducers
      store.dispatch({ type: 'C' });
      assert.strictEqual(store.getState(), 'ABC');
    });
    it('with enhancer should call reducers added anytime before they are dispatched', () => {
      // Add reducer before creating store
      onLetterReducer('A');
      // Create store and store.on helper
      const store = createMockStore(state => state, '', enhancer);
      const onStoreLetterReducer = onFactory(store);
      // Add reducers after creating store but before dispatch
      onStoreLetterReducer('B');
      onLetterReducer('C');
      // Dispatch some actions
      store.dispatch({ type: 'A' });
      store.dispatch({ type: 'B' });
      store.dispatch({ type: 'C' });
      // Add reducers after creating store and dispatch
      onLetterReducer('D');
      onStoreLetterReducer('E');
      // Dispatch to remaining reducers
      store.dispatch({ type: 'D' });
      store.dispatch({ type: 'E' });
      assert.strictEqual(store.getState(), 'ABCDE');
    });
    it('with reducer and enhancer should call reducers twice', () => {
      // Add reducer before creating store
      onLetterReducer('A');
      // Create store and store.on helper
      const store = createMockStore(reducer, '', enhancer);
      const onStoreLetterReducer = onFactory(store);
      // Add reducers after creating store but before dispatch
      onStoreLetterReducer('B');
      onLetterReducer('C');
      // Dispatch some actions
      store.dispatch({ type: 'A' });
      store.dispatch({ type: 'B' });
      store.dispatch({ type: 'C' });
      // Add reducers after creating store and dispatch
      onLetterReducer('D');
      onStoreLetterReducer('E');
      // Dispatch to remaining reducers
      store.dispatch({ type: 'D' });
      store.dispatch({ type: 'E' });
      assert.strictEqual(store.getState(), 'AABBCCDDEE');
    });
  });
});
