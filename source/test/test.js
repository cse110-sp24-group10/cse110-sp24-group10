import assert from 'assert';
import { addNums } from '../sample.js';
describe('Sample.js Tests', function() {
    describe('add()', function() {
        it('should correctly add two numbers', function() {
            assert.equal(addNums(1, 2), 3);
            assert.equal(addNums(-1, -2), -3);
            assert.notEqual(addNums(1, 2), 4);
        });
    });
});