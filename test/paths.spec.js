import { assert, expect } from 'chai';
import {
  nextPart,
  remainingPart,
  updateStatePathWithReducer
} from '../src/paths';

describe('Path utility function', () => {
  describe('nextPart', () => {
    it('should be a function', () => {
      assert.isFunction(nextPart);
    });
    it('should return the full path if no dots', () => {
      expect(nextPart('path')).to.equal('path');
    });
    it('should return the part before the dot if present', () => {
      expect(nextPart('path.with.dots')).to.equal('path');
    });
  });
  describe('remainingPart', () => {
    it('should be a function', () => {
      assert.isFunction(remainingPart);
    });
    it('should return the full path if no dots', () => {
      expect(remainingPart('path')).to.equal('');
    });
    it('should return the part before the dot if present', () => {
      expect(remainingPart('path.with.dots')).to.equal('with.dots');
    });
  });
  describe('updateStatePathWithReducer', () => {
    it('should be a function', () => {
      assert.isFunction(updateStatePathWithReducer);
    });
    it('should return same state with no reducer', () => {
      const state = {};
      expect(updateStatePathWithReducer({ state })).to.deep.equal(state);
    });
    it('should merge undefined state and path to the value', () => {
      const value = {};
      const reducer = () => value;
      expect(updateStatePathWithReducer({ reducer })).to.deep.equal(value);
    });
    it('should merge undefined state and existing path to the value at the right path', () => {
      const value = { with: 'property' };
      const reducer = () => value;
      expect(
        updateStatePathWithReducer({ path: 'state', reducer })
      ).to.deep.equal({
        state: value
      });
    });
    it('should merge existing state and path with value', () => {
      const state = {
        untouched: 'value',
        counter: 1
      };
      const incReducer = (counter, { by }) => counter + by;
      expect(
        updateStatePathWithReducer({
          state,
          path: 'counter',
          reducer: incReducer,
          action: { by: 2 }
        })
      ).to.deep.equal({
        untouched: 'value',
        counter: 3
      });
    });
    it('should merge existing state and path with overlapping value', () => {
      const state = {
        existing: {
          nested: {
            property: 'value',
            makeMeShout: 'I am very quiet'
          }
        }
      };
      const shoutReducer = text => text.toUpperCase();
      expect(
        updateStatePathWithReducer({
          state,
          path: 'existing.nested.makeMeShout',
          reducer: shoutReducer
        })
      ).to.deep.equal({
        existing: {
          nested: {
            property: 'value',
            makeMeShout: 'I AM VERY QUIET'
          }
        }
      });
    });
  });
});
