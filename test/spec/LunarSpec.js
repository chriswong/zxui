    define(function (require) {
        var lib = require('lib');
        
        var Lunar = require('Lunar');
        
        var lunar;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd',
                '<div class="ecl-ui-lunar c-clearfix"></div>'
            );

            lunar = new Lunar({
                main: lib.q('ecl-ui-lunar')[0],
                value: '1981-09-17'
            }).render();
        });


        afterEach(function () {
            lunar.dispose();
        });
      
        describe('日期格式化', function () {

            it('yyyy-M-d', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-M-d';
                var formatted = lunar.format(date, format);
                var millisecond = lunar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-5-1');
                expect(millisecond).toBe(date.getTime());
            });

            it('yyyy-MM-d', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-d';
                var formatted = lunar.format(date, format);
                var ms = lunar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-1');
                expect(ms).toBe(date.getTime());
            });

            it('default(yyyy-MM-dd)', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-dd';
                var formatted = lunar.format(date, format);
                var ms = lunar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-01');
                expect(ms).toBe(date.getTime());
            });

            it('yyyy-MM-dd W', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-dd W';
                var formatted = lunar.format(date, format);
                var ms = lunar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-01 三');
                expect(ms).toBe(date.getTime());
            });

            it('WW', function () {
                var date = new Date(2013, 4, 1);
                var format = 'WW';
                var formatted = lunar.format(date, format);

                expect(formatted).toBe('周三');
            });
        });

        
        describe('标准接口', function () {

            it('setRange', function () {
                lunar.setValue('2013-05-01');

                lunar.setRange({begin: '2013-06-01'});

                var prev = lib.q('ecl-ui-lunar-pre', lunar.main)[0];
                var next = lib.q('ecl-ui-lunar-next', lunar.main)[0];
                expect(prev.offsetHeight).toBe(0);

                lunar.setValue('2013-06-01');
                lunar.setRange({
                    begin: '2013-04-01',
                    end: new Date(2013, 5, 1)
                });
                expect(next.offsetHeight).toBe(0);
            });

        });

    });