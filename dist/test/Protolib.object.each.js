(function () {
    'use strict';

    var expect;
    if(typeof window === 'object' && window.expect) {
        expect = window.expect;
    }
    else {
        expect = require('chai').expect;
    }

    describe('ProtoLib.object.each', function () {

        // Create some test data
        var obj = {
                foo      : 'bar',
                numeric  : 1,
                bool     : false,
                nan      : NaN,
                zero     : 0,
                negative : -1,
                obj      : { foo: 'bar' },
                self     : null,
                array    : [1, 2, 3, 4],
                func     : function () {
                    console.log('HELLO WORLD');
                }
            };

            obj.self = obj;
            var arr = ['bar', 1, false, NaN, 0, -1, { foo: 'bar' }, obj, [1, 2, 3, 4], function () { console.log('HELLO WORLD'); }];

        arr.push(arr);
        obj.arr = arr;

        before(function () {
            if(typeof window !== 'object' && !Object._) new (require('../'))('_');
        });

        it('It should iterate over objects and arrays as expected', function () {
            expect(Object._.each).to.be.an.instanceof(Function);
            var isArr, currentObj;

            var eachCallback = function (value, key, iteration) {
                expect(this).to.equal(currentObj);

                switch(iteration) {
                    case 0:
                        if(!isArr) expect(key).to.equal('foo');
                        expect(value).to.equal('bar');
                        break;

                    case 1:
                        if(!isArr) expect(key).to.equal('numeric');
                        expect(value).to.equal(1);
                        break;

                    case 2:
                        if(!isArr) expect(key).to.equal('bool');
                        expect(value).to.equal(false);
                        break;

                    case 3:
                        if(!isArr) expect(key).to.equal('nan');
                        expect(value).to.not.be.a('NaN');
                        break;

                    case 4:
                        if(!isArr) expect(key).to.equal('zero');
                        expect(value).to.equal(0);
                        break;

                    case 5:
                        if(!isArr) expect(key).to.equal('negative');
                        expect(value).to.equal(-1);
                        break;

                    case 6:
                        if(!isArr) expect(key).to.equal('obj');
                        expect(value).to.have.keys(['foo']);
                        break;

                    case 7:
                        if(!isArr) expect(key).to.equal('self');
                        expect(value).to.equal(obj);
                        break;

                    case 8:
                        if(!isArr) expect(key).to.equal('array');
                        expect(value).to.an.instanceof(Array);
                        expect(value.length).to.equal(4);

                        var i = 0;
                        value._.each(function (val, key, iteration) {
                            expect(this).to.an.instanceof(Array);
                            expect(this.length).to.equal(4);
                            expect(val === i && i === iteration && iteration === key);
                        });
                        break;

                    case 9:
                        if(!isArr) expect(key).to.equal('func');
                        expect(value).to.an.instanceof(Function);
                        break;
                }
            };

            isArr = false; currentObj = obj;
            obj._.each(eachCallback);

            isArr = true; currentObj = arr;
            arr._.each(eachCallback);

            var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            x._.each(0, 3, function (val, key) { this[key] *= 7; });
            expect(x).to.eql([7, 14, 21, 28, 5, 6, 7, 8, 9, 10]);

            x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            x._.each(4, 3, function (val, key) { this[key] *= 7; });
            expect(x).to.eql([1, 2, 3, 28, 35, 6, 7, 8, 9, 10]);

            x = [1, 2, 3, 4, 5];
            x._.each(10000, -1, function (val, key) { this[key] *= 7; });
            expect(x).to.eql([7, 14, 21, 28, 35]);

            x = ['d', 'l', 'r', 'o', 'w', ' ', 'o', 'l', 'l', 'e', 'h'];
            var y = '';
            x._.each(10000, 0, function (val) {
                y += val;
            });
            expect(y).to.eql('hello world');
        });

        it('It should break when the exit() argument is called', function () {
            expect(Object._.each).to.be.an.instanceof(Function);
            var i = 0, exitCalled = false, resI = null;

            var res = [0, 1, 2, 3, 4, 5]._.each(function (value, key, iteration, exit) {
                expect(i).to.equal(value);
                i++;
                if(i === 2) {
                    exit(function () {
                        resI       = i;
                        exitCalled = true;
                    });
                }
            });

            res();
            expect(exitCalled).to.equal(true);
            expect(resI).to.equal(2);
        });

        it('It should iterate over strings as expected', function () {
            expect(Object._.each).to.be.an.instanceof(Function);
            var string = 'somereallyreallyreallylongstring';

            string._.each(function (char) {
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });

            var c = string._.each(function (char, k, i, exit) {
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
                if(i === 9) exit(char);
            });

            expect(c).to.equal('y');

            c = string._.each(function (char, k, i, exit) {
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
                if(i === 9) exit(char, 'arg2', 'arg3');
            });

            expect(c).to.be.an.instanceof(Array);
            expect(c[0]).to.be.equal('y');
            expect(c[1]).to.be.equal('arg2');
            expect(c[2]).to.be.equal('arg3');
        });

        it('It should iterate over start and end ranges as expected', function () {
            expect(Object._.each).to.be.an.instanceof(Function);
            var string = 'somereallyreallyreallylongstring';

            var val = '';
            string._.each(1, 2, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('om');

            val = '';
            string._.each(2, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('mereallyreallyreallylongstring');

            val = '';
            string._.each(-20, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('somereallyreallyreallylongstring');

            val = '';
            string._.each(-20, 2000, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('somereallyreallyreallylongstring');

            val = '';
            string._.each(-20, -1000, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('');

            val = '';
            string._.each(100000, 0, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('gnirtsgnolyllaeryllaeryllaeremos');

            val = '';
            string._.each(100000, 1, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('gnirtsgnolyllaeryllaeryllaeremo');

            val = '';
            string._.each(200, -100, function (char) {
                val += char;
                expect(this).to.equal('somereallyreallyreallylongstring');
                expect(char).to.be.a('string');
                expect(char).to.have.length(1);
            });
            expect(val).to.equal('gnirtsgnolyllaeryllaeryllaeremos');
        });

        it('It should iterate over numbers as expected', function () {
            expect(Object._.each).to.be.an.instanceof(Function);
            var numbers = [
                    1235435234,
                    123123.123,
                    123e2,
                    0x00234,
                    0,
                    -123,
                    -123e56,
                    -11234.123123
                ],
                currentNumber;

            var numberCallback = function (digit, k, i) {
                expect(this).to.equal(currentNumber);
                if(digit !== '.' && digit !== '-' && digit !== 'e' && digit !== '+') {
                    expect(digit).to.be.a('number');
                    expect(digit).lt(10);
                    expect(digit).gte(0);
                }
                else if(this < 0 && i === 0) {
                    expect(digit).to.equal('-');
                }
            };

            for(var i = 0; i < 8; i++) {
                currentNumber = numbers[i];
                currentNumber._.each(numberCallback);
            }
        });

        it('It should iterate over functions as if they were strings', function () {
            expect(Object._.each).to.be.an.instanceof(Function);

            var func = function () { console.log('HELLO WORLD'); };
            func._.each(function (char, k, i) {
                expect(this).to.equal(func);
                expect(char).to.be.a('string');
                switch(i) {
                    case 0:
                        expect(char).to.equal('f');
                        break;

                    case 1:
                        expect(char).to.equal('u');
                        break;

                    case 2:
                        expect(char).to.equal('n');
                        break;

                    case 3:
                        expect(char).to.equal('c');
                        break;

                    case 4:
                        expect(char).to.equal('t');
                        break;

                    case 27:
                        expect(char).to.equal('H');
                        break;

                    case 33:
                        expect(char).to.equal('W');
                        break;
                }
            });
        });

        it('It should iterate over booleans as if they were strings', function () {
            expect(Object._.each).to.be.an.instanceof(Function);

            true._.each(function (char, k, i) {
                expect(this).to.equal(true);
                expect(char).to.be.a('string');
                switch(i) {
                    case 0:
                        expect(char).to.equal('t');
                        break;

                    case 1:
                        expect(char).to.equal('r');
                        break;

                    case 2:
                        expect(char).to.equal('u');
                        break;

                    case 3:
                        expect(char).to.equal('e');
                        break;
                }
            });

            false._.each(function (char, k, i) {
                expect(this).to.equal(false);
                expect(char).to.be.a('string');
                switch(i) {
                    case 0:
                        expect(k == i && i === 0).to.be.true; // jshint ignore:line
                        expect(char).to.equal('f');
                        break;

                    case 1:
                        expect(k == i && i === 1).to.be.true; // jshint ignore:line
                        expect(char).to.equal('a');
                        break;

                    case 2:
                        expect(char).to.equal('l');
                        break;

                    case 3:
                        expect(char).to.equal('s');
                        break;

                    case 4:
                        expect(char).to.equal('e');
                        break;
                }
            });
        });
    });
}());
