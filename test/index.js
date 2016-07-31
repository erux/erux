import { assert } from 'chai';
import Erux from '../src/index';

describe('Erux', () => {
  const reducerError = 'reducer to be a function';
  describe('reducer function to get a reducer', () => {
    it('should be a function', () => {
      assert.isFunction(Erux.reducer);
      assert.strictEqual(Erux.reducer.length, 2);
    });
    it('should fail without any reducers', () => {
      assert.throws(Erux.reducer, reducerError);
    });
  });

  describe('enhancer function to get an enhancer', () => {
    it('should be a function', () => {
      assert.isFunction(Erux.enhancer);
      assert.strictEqual(Erux.enhancer.length, 1);
      assert.isFunction(Erux.enhancer());
      assert.strictEqual(Erux.enhancer().length, 3);
    });
    it('should accept a function and return a function', () => {
      const enhancer = Erux.enhancer(() => null);
      assert.isFunction(enhancer);
      assert.strictEqual(enhancer.length, 3);
    });
    it('should fail without any reducers', () => {
      assert.throws(Erux.enhancer(() => null), reducerError);
    });
  });

  describe('on function to add a reducer for an action type', () => {
    it('should be a function', () => {
      assert.isFunction(Erux.on);
      assert.strictEqual(Erux.on.length, 2);
    });
    it('should fail without type', () => {
      const typeError = 'Type is required';
      assert.throws(Erux.on, typeError);
      assert.throws(() => Erux.on(''), typeError);
      assert.throws(() => Erux.on([]), typeError);
      assert.throws(() => Erux.on({}), typeError);
    });
    it('should fail without reducer', () => {
      assert.throws(() => Erux.on(' '), reducerError);
    });
  });
});
