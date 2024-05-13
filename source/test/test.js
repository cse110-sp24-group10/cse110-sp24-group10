const assert = require('assert');
import { addNums } from 'source/sample.js';

describe('Sample.js Tests', function() {
    describe('add()', function() {
        it('should correctly add two numbers', function() {
            assert.equal(addNums(1, 2), 3);
            assert.equal(addNums(-1, -2), -3);
            assert.equal(addNums(-1, 1), 0);
        });
    });
});