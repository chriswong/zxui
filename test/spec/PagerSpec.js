    define(function (require) {
        var Pager = require('Pager');
        
        var pager;

        beforeEach(function () {
            document.body.insertAdjacentHTML(
                'beforeEnd', ''
                    + '<div id="pagerContainer" class="result-op"'
                    + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                    + ' style="display:none">'
                    +   '<div class="ecl-ui-pager c-clearfix"></div>'
                    + '</div>'
            );

            pager = new Pager({
                prefix: 'ecl-ui-pager',
                main: T.q('ecl-ui-pager')[0],
                page: 0,
                total: 18
              });
            pager.render();
            
        });


        afterEach(function () {
            T.dom.remove(T.g('pagerContainer'));
            pager.dispose();
        });
      
        describe('基本接口', function () {

            it('控件类型', function () {

                expect(pager.type).toBe('Pager');

            });

            it('分页逻辑', function () {
                expect(pager.getPage()).toBe(0);

                pager.setPage(2);
                expect(pager.getPage()).toBe(2);
            });

        });

    });