import { assert, expect } from 'chai';
import sinon, { spy } from 'sinon';
import { enhancer, actionsWithPathAndReducers } from '../src';
import createMockStore from './createMockStore';

describe('actionsWithPathAndReducers', () => {
  it('should be a function', () => {
    assert.isFunction(actionsWithPathAndReducers);
  });
  describe('when called', () => {
    describe('without a store', () => {
      it('should throw an error', () => {
        assert.throws(() => actionsWithPathAndReducers(), TypeError);
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
        describe('without actions', () => {
          it('should return an empty object', () => {
            const withAPathOnly = actionsWithPathAndReducers({
              path
            });
            expect(withAPathOnly).to.deep.equal({});
          });
        });
        describe('and reducers', () => {
          const reducers = {
            inc: ({ counter = 0 }) => ({
              counter: counter + 1
            }),
            incBy: ({ counter = 0 }, { by }) => ({
              counter: counter + by
            }),
            CapitalAction: Function.prototype
          };
          const withAPathAndReducers = actionsWithPathAndReducers({
            path,
            reducers
          });
          it('should return an object of action creators', () => {
            assert.isObject(withAPathAndReducers);
          });
          describe('inc property', () => {
            const { inc } = withAPathAndReducers;
            it('should be a function', () => {
              assert.isFunction(inc);
            });
            it('should create the INC action when called and handle the action when dispatched', () => {
              const action = inc();
              expect(action).to.deep.equal({
                type: 'INC'
              });
              dispatch(action);
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 1
                  }
                }
              });
              dispatch(action);
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
            const { incBy } = withAPathAndReducers;
            it('should be a function', () => {
              assert.isFunction(incBy);
            });
            it('should dispatch the INC_BY action when called', () => {
              const action = incBy({ by: 2 });
              expect(action).to.deep.equal({
                type: 'INC_BY',
                by: 2
              });
              dispatch(action);
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
              expect(store.getState()).to.deep.equal({
                state: {
                  path: {
                    counter: 2
                  }
                }
              });
              dispatch(incBy({ by: 3 }));
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
            const { CapitalAction } = withAPathAndReducers;
            it('should be a function', () => {
              assert.isFunction(CapitalAction);
            });
            it('should dispatch the CAPITAL_ACTION action when called', () => {
              const action = CapitalAction();
              expect(action).to.deep.equal({
                type: 'CAPITAL_ACTION'
              });
              dispatch(action);
              sinon.assert.alwaysCalledWithExactly(dispatch, action);
            });
          });
        });
      });
    });
  });
});
