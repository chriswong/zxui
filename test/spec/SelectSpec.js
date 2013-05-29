    define(function (require) {
        var Select = require('Select');
        
        var select;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd', ''
                    + '<div id="selectContainer" class="result-op"'
                    + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                    + ' style="display:none">'
                    +   '<a href="#" class="ecl-ui-sel-target">'
                    +       '<b>商圈</b><i></i>'
                    +   '</a>'
                    +   '<p class="ecl-ui-sel">'
                    +       '<a href="#" data-value="0">不限</a>'
                    +       '<a href="#" data-value="1">中关村、上地</a>'
                    +       '<a href="#" data-value="2">亚运村</a>'
                    +       '<a href="#" data-value="3">公主坟商圈</a>'
                    +       '<a href="#" data-value="4">劲松潘家园</a>'
                    +       '<a href="#" data-value="5">北京南站商圈超长</a>'
                    +     '</p>'
                    + '</div>'
            );

            select = new Select({
                prefix: 'ecl-ui-sel',
                main: T.q('ecl-ui-sel')[0],
                target: T.q('ecl-ui-sel-target')[0],
                maxLength: 8,
                offset: {
                  y: -1
                }
              });
            select.render();
            
        });


        afterEach(function () {
            T.dom.remove(T.g('selectContainer'));
            select.dispose();
        });
      
        describe('基本接口', function () {

            it('控件类型', function () {

                expect(select.type).toBe('Select');

            });

            it('显示/隐藏', function () {
                var isVisible = false;
                select.on('show', function () {
                    isVisible = true;
                    select.un(arguments.callee);
                });
                select.show();

                expect(isVisible).toBeTruthy();

                var isHide = false;
                select.on('hide', function () {
                    isHide = true;
                    select.un(arguments.callee);
                });
                select.hide();

                expect(isHide).toBeTruthy();
            });

        });

    });