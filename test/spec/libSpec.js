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

            });

            it('数组判断', function () {

                expect(lib.isArray).not.toBeUndefined();

                expect(lib.isArray(['simply array'])).toBeTruthy();

                expect(lib.isArray(new Array(5))).toBeTruthy();

            });

            it('函数判断', function () {

                expect(lib.isFunction).not.toBeUndefined();

                expect(lib.isFunction(lib.isFunction)).toBeTruthy();

            });

            it('日期判断', function () {

                expect(lib.isDate).not.toBeUndefined();

                expect(lib.isDate(new Date())).toBeTruthy();

            });

            it('对象判断', function () {

                expect(lib.isObject).not.toBeUndefined();

                expect(lib.isObject(lib)).toBeTruthy();

                /* jshint -W010 */
                expect(lib.isObject({})).toBeTruthy();

                expect(lib.isObject(new Object())).toBeTruthy();

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