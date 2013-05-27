    define(function (require) {
        var City = require('city');
        
        var city;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd', ''
                    + '<div id="cityContainer" class="result-op"'
                    + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                    + ' style="display:none">'
                    + ' <input type="text" class="city-trigger" />'
                    + ' <input type="button" value="click" '
                    + '     class="city-trigger" />'
                    + '</div>'
            );

            var triggers = T.q('city-trigger');
            city = new City({
                prefix: 'ecl-ui-city',
                index: 2,
                triggers: triggers,
                target: triggers[0],
                hideCities: '上海'
            });
            city.render();
        });


        afterEach(function () {
            T.dom.remove(T.g('cityContainer'));
            city.dispose();
        });
      
        describe('基本接口', function () {

            it('控件类型', function () {

                expect(city.type).toBe('City');

            });

            it('显示/隐藏', function () {
                var isVisible = false;
                city.on('show', function () {
                    isVisible = true;
                    city.un(arguments.callee);
                });
                city.show();

                expect(isVisible).toBeTruthy();

                var isHide = false;
                city.on('hide', function () {
                    isHide = true;
                    city.un(arguments.callee);
                });
                city.hide();

                expect(isHide).toBeTruthy();
            });

            it('默认激活', function () {
                expect(city.index).toBe(2);
            });

            it('隐藏城市', function () {
                city.onBeforeShow();
                expect(city.panels.length).toBe(5);

                expect(
                    city.panels[0].getElementsByTagName('a')[0].innerHTML
                ).not.toBe('上海');
            });

        });

        describe('其它', function () {
            
            it('setTarget', function () {
                expect(function () {
                    city.setTarget(T.q('city-trigger')[0]);
                }).not.toThrow();
                expect(city.setTarget).toThrow();
            });
        });

    });