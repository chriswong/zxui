    define(function (require) {
        var Calendar = require('calendar');
        
        var calendar;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd', ''
                    + '<div id="calendarContainer" class="result-op"'
                    + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                    + ' style="display:none">'
                    + ' <input type="text" class="calendar-trigger" />'
                    + ' <input type="button" value="click"'
                    + '     class="calendar-trigger" />'
                    + '</div>'
            );

            var triggers = T.q('calendar-trigger');
            calendar = new Calendar({
                prefix: 'ecl-hotel-ui-cal',
                triggers: triggers,
                target: triggers[0]
            });
            calendar.render();
        });


        afterEach(function () {
            T.dom.remove(T.g('calendarContainer'));
            calendar.dispose();
        });
      
        describe('日期格式化', function () {

            it('yyyy-M-d', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-M-d';
                var formatted = calendar.format(date, format);
                var millisecond = calendar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-5-1');
                expect(millisecond).toBe(date.getTime());
            });

            it('yyyy-MM-d', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-d';
                var formatted = calendar.format(date, format);
                var ms = calendar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-1');
                expect(ms).toBe(date.getTime());
            });

            it('default(yyyy-MM-dd)', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-dd';
                var formatted = calendar.format(date, format);
                var ms = calendar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-01');
                expect(ms).toBe(date.getTime());
            });

            it('yyyy-MM-dd W', function () {
                var date = new Date(2013, 4, 1);
                var format = 'yyyy-MM-dd W';
                var formatted = calendar.format(date, format);
                var ms = calendar.from(formatted, format).getTime();

                expect(formatted).toBe('2013-05-01 三');
                expect(ms).toBe(date.getTime());
            });

            it('WW', function () {
                var date = new Date(2013, 4, 1);
                var format = 'WW';
                var formatted = calendar.format(date, format);

                expect(formatted).toBe('周三');
            });
        });

        
        describe('标准接口', function () {

            it('validate & checkValidity', function () {
                calendar.target.value = '2013-05-01';
                expect(calendar.validate()).toBeTruthy();
                expect(calendar.checkValidity()).toBeTruthy();

                calendar.target.value = '2013-5-1';
                expect(calendar.validate()).not.toBeTruthy();
                expect(calendar.checkValidity()).not.toBeTruthy();
            });

            it('setRange', function () {
                var value = '2013-05-01';
                calendar.target.value = value;

                calendar.setRange({begin: '2013-06-01'});
                expect(calendar.validate()).toBeFalsy();

                calendar.setRange({
                    begin: '2013-04-01',
                    end: new Date(2013, 5, 1)
                });
                expect(calendar.validate()).toBeTruthy();
            });

            it('getValue & getValueAsDate', function () {
                var value = '2013-05-01';
                calendar.target.value = value;
                expect(calendar.getValue()).toEqual(value);
                expect(calendar.getValueAsDate()).toEqual(new Date(2013, 4, 1));
            });
        });

        describe('其它', function () {
            
            it('setTarget', function () {
                expect(function () {
                    calendar.setTarget(T.q('calendar-trigger')[0]);
                }).not.toThrow();
                expect(calendar.setTarget).toThrow();
            });
        });

    });