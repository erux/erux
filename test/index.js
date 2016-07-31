import { assert } from 'chai';
import Duxe from '../src/index';

describe('Duxe', () => {
  const reducerError = 'reducer to be a function';
  describe('reducer function to get a reducer', () => {
    it('should be a function', () => {
      assert.isFunction(Duxe.reducer);
      assert.strictEqual(Duxe.reducer.length, 2);
    });
    it('should fail without any reducers', () => {
      assert.throws(Duxe.reducer, reducerError);
    });
  });

  describe('enhancer function to get an enhancer', () => {
    it('should be a function', () => {
      assert.isFunction(Duxe.enhancer);
      assert.strictEqual(Duxe.enhancer.length, 1);
      assert.isFunction(Duxe.enhancer());
      assert.strictEqual(Duxe.enhancer().length, 3);
    });
    it('should accept a function and return a function', () => {
      const enhancer = Duxe.enhancer(() => null);
      assert.isFunction(enhancer);
      assert.strictEqual(enhancer.length, 3);
    });
    it('should fail without any reducers', () => {
      assert.throws(Duxe.enhancer(() => null), reducerError);
    });
  });

  describe('on function to add a reducer for an action type', () => {
    it('should be a function', () => {
      assert.isFunction(Duxe.on);
      assert.strictEqual(Duxe.on.length, 2);
    });
    it('should fail without type', () => {
      const typeError = 'Type is required';
      assert.throws(Duxe.on, typeError);
      assert.throws(() => Duxe.on(''), typeError);
      assert.throws(() => Duxe.on([]), typeError);
      assert.throws(() => Duxe.on({}), typeError);
    });
    it('should fail without reducer', () => {
      assert.throws(() => Duxe.on(' '), reducerError);
    });
  });
});
