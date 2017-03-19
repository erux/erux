import { assert, expect } from 'chai';
import sinon, { spy } from 'sinon';
import { enhancer, withStorePathAndActions } from '../src';
import createMockStore from './createMockStore';

describe('withStorePathAndActions', () => {
  it('should be a function', () => {
    assert.isFunction(withStorePathAndActions);
  });
  describe('when called', () => {
    describe('without a store', () => {
      it('should throw an error', () => {
        assert.throws(() => withStorePathAndActions(), TypeError);
      });
    });
    describe('with a store', () => {
      const identityReducer = spy(state => state);
      const store = createMockStore(identityReducer, undefined, enhancer);
      const { dispatch } = store;
      beforeEach(() => {
        store.clearState();
        dispatch.reset();
      });
      it('should call existing reducer for unknown actions', () => {
        const unknownAction = {};
        dispatch(unknownAction);
        sinon.assert.alwaysCalledWithExactly(
          identityReducer,
          undefined,
          unknownAction
        );
      });
      describe('and path', () => {
        const path = 'state.path';
        describe('and actions', () => {
          const actions = {
            inc: ({ counter = 0 }) => ({
              counter: counter + 1
            }),
            incBy: ({ counter = 0 }, { by }) => ({
              counter: counter + by
            }),
            CapitalAction: Function.prototype
          };
          const withAStoreAndAPathAndActions = withStorePathAndActions({
            store,
            path,
            actions
          });
          it('should return an object of action creators', () => {
            assert.isObject(withAStoreAndAPathAndActions);
          });
          describe('inc property', () => {
            const { inc } = withAStoreAndAPathAndActions;
            it('should be a function', () => {
              assert.isFunction(inc);
            });
            it('should dispatch the INC action when called', () => {
              const action = inc();
              expect(action).to.deep.equal({
                type: 'INC'
              });
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 1
                  }
                }
              });
              inc();
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 2
                  }
                }
              });
            });
          });
          describe('incBy property', () => {
            const { incBy } = withAStoreAndAPathAndActions;
            it('should be a function', () => {
              assert.isFunction(incBy);
            });
            it('should dispatch the INC_BY action when called', () => {
              const action = incBy({ by: 2 });
              expect(action).to.deep.equal({
                type: 'INC_BY',
                by: 2
              });
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 2
                  }
                }
              });
              incBy({ by: 3 });
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 5
                  }
                }
              });
            });
          });
          describe('CapitalAction property', () => {
            const { CapitalAction } = withAStoreAndAPathAndActions;
            it('should be a function', () => {
              assert.isFunction(CapitalAction);
            });
            it('should dispatch the CAPITAL_ACTION action when called', () => {
              const action = CapitalAction();
              expect(action).to.deep.equal({
                type: 'CAPITAL_ACTION'
              });
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
            });
          });
        });
      });
    });
  });
});
