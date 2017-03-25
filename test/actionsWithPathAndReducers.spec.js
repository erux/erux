import { assert, expect } from 'chai';
import { actionsWithPathAndReducers, makeReducer } from '../src';

describe('actionsWithPathAndReducers', () => {
  it('should be a function', () => {
    assert.isFunction(actionsWithPathAndReducers);
  });
  describe('when called', () => {
    describe('without parameters', () => {
      it('should throw an error', () => {
        assert.throws(() => actionsWithPathAndReducers(), TypeError);
      });
    });
    describe('with a path', () => {
      const path = 'state.path';
      it('should return an empty object', () => {
        const withAPathOnly = actionsWithPathAndReducers({
          path
        });
        expect(withAPathOnly).to.deep.equal({});
      });
      describe('and reducers', () => {
        const reducers = {
          inc: ({ counter = 0 }) => ({
            counter: counter + 1
          }),
          incBy: ({ counter = 0 }, { by }) => ({
            counter: counter + by
          }),
          CapitalAction: state => state.toUpperCase()
        };
        const withAPathAndReducers = actionsWithPathAndReducers({
          path,
          reducers
        });
        const reducer = makeReducer(state => state);
        it('should return an object of action creators', () => {
          assert.isObject(withAPathAndReducers);
        });
        it('should call existing reducer for unknown actions', () => {
          const unknownAction = {};
          const stateAfter = reducer(undefined, unknownAction);
          assert.isUndefined(stateAfter);
        });
        describe('inc property', () => {
          const { inc } = withAPathAndReducers;
          it('should be a function', () => {
            assert.isFunction(inc);
          });
          it('should create the INC action when called and handle the action in the reducer', () => {
            const action = inc();
            expect(action).to.deep.equal({
              type: 'INC'
            });
            const stateAfter = reducer(undefined, action);
            expect(stateAfter).to.deep.equal({
              state: {
                path: {
                  counter: 1
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
          it('should create the INC_BY action when called and handle the action in the reducer', () => {
            const action = incBy({ by: 2 });
            expect(action).to.deep.equal({
              type: 'INC_BY',
              by: 2
            });
            const stateAfter = reducer(undefined, action);
            expect(stateAfter).to.deep.equal({
              state: {
                path: {
                  counter: 2
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
          it('should create the CAPITAL_ACTION action when called and handle the action in the reducer', () => {
            const action = CapitalAction();
            expect(action).to.deep.equal({
              type: 'CAPITAL_ACTION'
            });
            const stateBefore = {
              state: {
                path: 'quiet action'
              }
            };
            const stateAfter = reducer(stateBefore, action);
            expect(stateAfter).to.deep.equal({
              state: {
                path: 'QUIET ACTION'
              }
            });
          });
        });

        describe('that have duplicate inc reducer for a different path', () => {
          it('should create the INC action when called and update two parts of the state', () => {
            const withDifferentPathAndDupReducers = actionsWithPathAndReducers({
              path: 'different.path',
              reducers
            });
            const { inc } = withDifferentPathAndDupReducers;
            const action = inc();
            expect(action).to.deep.equal({
              type: 'INC'
            });
            const stateAfter = reducer(undefined, action);
            expect(stateAfter).to.deep.equal({
              different: {
                path: {
                  counter: 1
                }
              },
              state: {
                path: {
                  counter: 1
                }
              }
            });
          });
        });
        describe('that have duplicate inc reducer for the same path', () => {
          it('should create the INC action when called and update two parts of the state once', () => {
            const withDupPathAndReducers = actionsWithPathAndReducers(
              {
                path,
                reducers
              },
              {
                path,
                reducers
              }
            );
            const { inc } = withDupPathAndReducers;
            const action = inc();
            expect(action).to.deep.equal({
              type: 'INC'
            });
            const stateAfter = reducer(undefined, action);
            expect(stateAfter).to.deep.equal({
              different: {
                path: {
                  counter: 1
                }
              },
              state: {
                path: {
                  counter: 1
                }
              }
            });
          });
        });
      });
    });
  });
});
