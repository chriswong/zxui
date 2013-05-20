define(function (require) {


    var log = require('log');
    
	log.start();

    var container;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="logContainer" class="result-op"'
                + ' style="display:none"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}">'
                + '统计区域二：<br />'
                + '<input type="button" value="配置data-nolog=1"'
                + ' data-nolog="1" />'
                + '<div data-click="{x:2, y: 2}">'
                + '<input type="button" value="配置x=2 y=3"'
                + ' data-click="{y: 3}" />'
                + '<span data-click="{y:4}">'
                + '<input type="button" value="x: 0, y: 5"'
                + ' data-click="{y: 5}" /></span></div>'
                + '<a href="http://www.baidu.com/?a=b&amp;c=d" target="_blank"'
                + '  data-click="{x:3, y: 2}">baidu - 配置x=3, y=2</a>'
                + '</div>'
        );
        container = T.g('logContainer');
    });

    afterEach(function () {
        T.dom.remove(container);
    });

    describe('属性继承', function () {
        it('无继承', function () {
            log.on('click', function (json) {
                var data = json.data;
                expect(data.x).toBe(1);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe('FD9FFD6C');

                log.un('click', arguments.callee);
            });
            log.click(container);
        });

        it('一层继承', function () {
            log.on('click', function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(2);

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('div')[0]);
        });

        it('二层继承', function () {
            log.on('click', function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(3);

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('input')[1]);
        });

        it('三层继承', function () {
            log.on('click', function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(5);

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('input')[2]);
        });

        it('从配置继承', function () {
            log.config({data: {foo: 'bar'}});
            log.on('click', function (json) {
                var data = json.data;
                expect(data.foo).toBe('bar');

                log.un('click', arguments.callee);
            });
            log.click(container);
        });
    });

    describe('禁止统计', function () {

        it('直接禁止', function () {
            var neverChange = true;
            log.on('click', function () {
                neverChange = false;

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('input')[0]);

            expect(neverChange).toBe(true);
        });

        it('祖先级禁止', function () {
            var neverChange = true;
            log.on('click', function () {
                neverChange = false;

                log.un('click', arguments.callee);
            });
            container.setAttribute('data-nolog', 1);
            log.click(container.getElementsByTagName('input')[1]);
            container.removeAttribute('data-nolog');

            expect(neverChange).toBe(true);
        });
    });

    describe('其它', function () {

        it('log.send', function () {
            log.on('send', function (json) {
                expect(json.url).toBe('http://sclick.baidu.com/w.gif?foo=bar');

                log.un('send', arguments.callee);
            });

            log.send({foo: 'bar'});
        });

        it('xpath - div(other)', function () {
            log.on('click', function (json) {
                expect(json.data['rsv_xpath']).toBe('div(other)');

                log.un('click', arguments.callee);
            });
            log.click(container);
        });

        it('xpath - div-span-input(btn)', function () {
            log.on('click', function (json) {
                expect(json.data['rsv_xpath']).toBe('div-span-input(btn)');

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('input')[2]);
        });

        it('type - btn for default', function () {
            log.on('click', function (json) {
                expect(json.data['rsv_xpath']).toMatch(/\(btn\)/);

                log.un('click', arguments.callee);
            });
            log.click(container.getElementsByTagName('input')[2]);
        });

        it('type - link for OP_LOG_LINK', function () {
            log.on('click', function (json) {
                expect(json.data['rsv_xpath']).toMatch(/\(link\)/);

                log.un('click', arguments.callee);
            });

            var el = container.getElementsByTagName('input')[2];
            T.addClass(el, 'OP_LOG_LINK');
            log.click(el);
            T.removeClass(el, 'OP_LOG_LINK');
        });
    });

});
