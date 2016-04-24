(function () {
    'use strict';

    var expect;
    if(typeof window === 'object' && window.expect) {
        expect = window.expect;
    }
    else {
        expect = require('chai').expect;
    }


    describe('Protolib.object.first', function () {
        before(function () {
            if(typeof window !== 'object' && !Object._) new (require('../'))('_');
        });

        // Create some test data
        var obj = { foo: 'bar', num: 2, bool: false },
            string = 'string',
            number = 124323,
            float  = 1324.234,
            func   = function () { console.log('HELLO WORLD!'); },
            subarr = [1, 2, 3];

        it('It should return the first item in an object', function () {
            var o = obj._.first();
            expect(o).to.equal('bar');
        });

        it('It should return the first item in an array', function () {
            var o = subarr._.first();
            expect(o).to.equal(1);
        });

        it('It should return the first character in a string', function () {
            var o = string._.first();
            expect(o).to.equal('s');
        });

        it('It should return the first digit in a number', function () {
            var o = number._.first();
            expect(o).to.equal('1');

            o = float._.first();
            expect(o).to.equal('1');
        });

        it('It should return the first charcter of a function cast to a string', function () {
            var o = func._.first();
            expect(o).to.equal('f');
        });

        it('It should return the first n items, if the a number argument is passed in as n', function () {
            expect(obj._.first(2)).to.eql({ foo: 'bar', num: 2 });
            expect(obj._.first(-2)).to.eql({});
            expect(obj._.first(0)).to.eql({});

            expect(subarr._.first(2)).to.eql([1, 2]);
            expect(subarr._.first(-2)).to.eql([1]); // Works like slice
            expect(subarr._.first(-1)).to.eql([1, 2]); // Works like slice
            expect(subarr._.first(0)).to.eql([]);

            expect(string._.first(2)).to.equal('st');
            expect(string._.first(-2)).to.equal('stri'); // Works like slice
            expect(string._.first(0)).to.equal(null);
        });
    });

}());
