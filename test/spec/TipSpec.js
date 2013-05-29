    define(function (require) {
        var Tip = require('Tip');
        
        var tip;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd', ''
                    + '<div id="tipContainer" class="result-op"'
                    + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                    + ' style="display:none">'
                    +   '<a href="http://www.baidu.com/"'
                    +   '   class="tooltip">百度</a>'
                    + '</div>'
            );

            tip = new Tip({
                mode: 'over',
                arrow: '1',
                hideDelay: 1,
                offset: { x: 5, y: 5}
              });
            tip.render();
            
        });


        afterEach(function () {
            T.dom.remove(T.g('tipContainer'));
            tip.dispose();
        });
      
        describe('基本接口', function () {

            it('控件类型', function () {

                expect(tip.type).toBe('Tip');

            });

        });

    });