    define(function (require) {
        var lib = require('lib');
        

        beforeEach(function () {

            
        });


        afterEach(function () {
        });
      
        describe('类型判断', function () {

            /* jshint -W053 */
            it('字符串判断', function () {

                expect(lib.isString).not.toBeUndefined();

                expect(lib.isString('just a pure string')).toBeTruthy();

                expect(lib.isString(new String('string create from new')))
                    .toBeTruthy();

                expect(lib.typeOf(new String('box string'))).toBe('string');

            });

            it('数组判断及转换', function () {

                expect(lib.isArray).not.toBeUndefined();

                expect(lib.isArray(['simply array'])).toBeTruthy();

                expect(lib.isArray(new Array(5))).toBeTruthy();

                expect(lib.typeOf([])).toBe('array');

                var array = lib.toArray(arguments);
                expect(lib.isArray(array)).toBe(true);

                array = lib.toArray(null);
                expect(lib.isArray(array)).toBe(true);

                array = lib.toArray([1, 2, 3]);
                expect(lib.isArray(array)).toBe(true);

                array = lib.toArray({length: 3, 0: 1, 1: 2, 2: 3});
                expect(lib.isArray(array)).toBe(true);

                array = lib.toArray(document.getElementsByTagName('*'));
                expect(lib.isArray(array)).toBe(true);

                array = lib.toArray(1);
                expect(lib.isArray(array)).toBe(true);

                array = [1, 2];
                expect(lib.clone(array) === array).toBeFalsy();

            });

            it('函数判断', function () {

                expect(lib.isFunction).not.toBeUndefined();

                expect(lib.isFunction(lib.isFunction)).toBeTruthy();

                expect(lib.typeOf(lib.isFunction)).toBe('function');

            });

            it('日期判断', function () {

                expect(lib.isDate).not.toBeUndefined();

                expect(lib.isDate(new Date())).toBeTruthy();

                expect(lib.typeOf(new Date())).toBe('date');

            });

            it('DOM判断', function () {
                expect(lib.typeOf(document.createElement('div'))).toBe('dom');

            });

            it('对象判断', function () {

                expect(lib.isObject).not.toBeUndefined();

                expect(lib.isObject(lib)).toBeTruthy();

                /* jshint -W010 */
                expect(lib.isObject({})).toBeTruthy();

                expect(lib.isObject(new Object())).toBeTruthy();

                expect(lib.typeOf({})).toBe('object');

            });

        });

        describe('JSON处理', function () {
            it('toQueryString', function () {
                var input = {a: [1, 2], b: 1, c: 'c', d: {e: 1}};
                var output = 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
                expect(lib.toQueryString(input)).toBe(output);
            });
        });

        describe('string处理', function () {
            it('camelCase', function () {
                var input = 'position-x';
                var output = 'positionX';
                expect(lib.camelCase(input)).toBe(output);

                input = 'border-left-width';
                output = 'borderLeftWidth';
                expect(lib.camelCase(input)).toBe(output);

                input = 'border-Left-width';
                output = 'borderLeftWidth';
                expect(lib.camelCase(input)).toBe(output);
            });

            it('capitalize', function () {
                var input = 'position';
                var output = 'Position';
                expect(lib.capitalize(input)).toBe(output);

                input = 'border-left-width';
                output = 'Border-Left-Width';
                expect(lib.capitalize(input)).toBe(output);

                input = 'border-Left-width';
                output = 'Border-Left-Width';
                expect(lib.capitalize(input)).toBe(output);
            });

            it('contains', function () {
                var input = 'position x ';
                expect(lib.contains(input)).toBe(true);

                input = 'border  left   width ';
                expect(lib.contains(input)).toBe(true);
            });

            it('pad', function () {
                var width = 5;
                var input = '5';
                var output = '00005';
                expect(lib.pad(input, width)).toBe(output);

                input = 10;
                output = '00010';
                expect(lib.pad(input, width)).toBe(output);

                input = 10000;
                output = '10000';
                expect(lib.pad(input, width)).toBe(output);

                input = 100000;
                output = '100000';
                expect(lib.pad(input, width)).toBe(output);

                input = -1000;
                output = '-01000';
                expect(lib.pad(input, width)).toBe(output);
            });
        });

        describe('function处理', function () {
            it('bind', function () {
                
            });
        });

        describe('类模拟', function () {
            var Cat;

            beforeEach(function () {
                Cat = lib.newClass({
                    initialize: function (name) {
                        this.name = name;
                    },

                    say: function () {
                        return 'Miao~';
                    }
                });                
            });

            afterEach(function () {
                Cat = null;
            });

            it('类创建', function () {

                var Rat = lib.newClass(function () {
                    this.name = 'Jerry';
                });

                var tom = new Cat('Tom');
                var jerry = new Rat();

                expect(tom instanceof Cat).toBeTruthy();
                expect(tom.name).toBe('Tom');
                expect(tom.say()).toBe('Miao~');

                expect(jerry.name).toBe('Jerry');
                expect(jerry instanceof Rat).toBeTruthy();
            });

            it('类扩展', function () {
                var tom = new Cat('Tom');

                expect(tom.name).toBe('Tom');
                expect(tom.say()).toBe('Miao~');
                expect(tom.eat).toBeUndefined();

                Cat.implement({
                    say: function () {
                        return 'Mao';
                    },

                    eat: function () {
                        return 'Fish';
                    }
                });

                expect(tom.say()).toBe('Mao');
                expect(tom.eat()).toBe('Fish');
            });

            it('类扩展', function () {
                var tom = new Cat('Tom');

                expect(tom.name).toBe('Tom');
                expect(tom.say()).toBe('Miao~');
                expect(tom.eat).toBeUndefined();

                Cat.implement({
                    say: function () {
                        return 'Mao';
                    },

                    eat: function () {
                        return 'Fish';
                    }
                });

                expect(tom.say()).toBe('Mao');
                expect(tom.eat()).toBe('Fish');
            });

            it('类继承', function () {
                Cat.implement({
                    eat: function () {
                        return 'Fish';
                    }
                });
                
                var Lion = Cat.extend({
                    initialize: function () {
                        this.name = 'Sinbad';
                    },

                    eat: function () {
                        return 'Meat' + this.parent('eat');
                    },

                    big: function () {
                        return true;
                    }
                });

                var sinbad = new Lion();

                expect(sinbad.name).toBe('Sinbad');
                expect(sinbad.eat()).toBe('MeatFish');
                expect(sinbad.big()).toBeTruthy();

                expect(sinbad instanceof Lion).toBe(true);
                expect(sinbad instanceof Cat).toBe(true);
            });

            it('事件实现', function () {
                Cat.implement(lib.observable);
                var tom = new Cat();

                var firedCatched = false;

                tom.on('catchRat', function () {
                    firedCatched = true;
                });
                tom.fire('catchRat');

                expect(firedCatched).toBe(true);

                tom.un('catchRat');
                firedCatched = false;
                tom.fire('catchRat');
                expect(firedCatched).toBe(false);

            });
        });

    });