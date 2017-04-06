import { assert, expect } from 'chai';
import { makeReducer } from '../src';
import { clearActionMappings } from '../src/actionMapping';

describe('makeReducer', () => {
  it('should be a function', () => {
    assert.isFunction(makeReducer);
  });
  it('should create a reducer that returns an empty object', () => {
    clearActionMappings();
    const reducer = makeReducer(state => state);
    const stateAfter = reducer(undefined, {});
    expect(stateAfter).to.deep.equal({});
  });
});
