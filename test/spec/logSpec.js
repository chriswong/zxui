define(function (require) {


    var log = require('log');
    
	log.start();

    var container;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="logContainer" class="result-op"'
                + ' mu="http://baike.baidu.com/view/1758.htm"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}">'
                +   '<h3>'
                +       '<a href="http://baike.baidu.com/view/1758.htm">'
                +           '统计区域二'
                +       '</a>'
                +   '</h3>：'
                +   '<input type="button" value="配置data-nolog=1"'
                +       ' data-nolog="1" />'
                +   '<div data-click="{x:2, y: 2}">'
                +       '<input type="button" value="配置x=2 y=3"'
                +           ' data-click="{y: 3}" />'
                +       '<span data-click="{y:4}">'
                +       '<input type="button" value="x: 0, y: 5"'
                +           ' data-click="{y: 5}" /></span>'
                +   '</div>'
                +   '<a href="http://www.baidu.com/?a=b&amp;c=d" '
                +       'target="_blank" data-click="{x:3, y: 2}">'
                +       'baidu - 配置x=3, y=2'
                +   '</a>'
                +   '<a href="http://www.baidu.com/?a=b&amp;c=d" '
                +       'target="_blank" data-click="{x:4, y: 3}">'
                +       'baidu - 配置x=4, y=3'
                +   '</a>'
                + '</div>'
        );
        container = T.g('logContainer');
    });

    afterEach(function () {
        T.dom.remove(container);
    });

    describe('属性继承', function () {
        it('顶层容器点击无上报', function () {
            var onClick = function (json) {
                expect(json.target !== container).toBeTruthy();
            };
            log.on('click', onClick);
            log.click(container);
            log.un('click', onClick);
        });

        it('一层继承', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(2);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('div')[0]);
            log.un('click', onClick);
        });

        it('二层继承', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(3);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[1]);
            log.un('click', onClick);
        });

        it('三层继承', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.x).toBe(2);
                expect(data.srcid).toBe(16874);
                expect(data.p1).toBe(2);
                expect(data.y).toBe(5);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[2]);
            log.un('click', onClick);
        });

        it('从配置继承', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.foo).toBe('bar');
            };
            log.config({data: {foo: 'bar'}});
            log.on('click', onClick);
            log.click(container.getElementsByTagName('div')[0]);
            log.un('click', onClick);
        });
    });

    describe('禁止统计', function () {

        it('直接禁止', function () {
            var neverChange = true;
            var onClick = function () {
                neverChange = false;
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[0]);
            log.un('click', onClick);

            expect(neverChange).toBe(true);
        });

        it('祖先级禁止', function () {
            var neverChange = true;
            var onClick = function () {
                neverChange = false;
            };
            log.on('click', onClick);
            container.setAttribute('data-nolog', 1);
            log.click(container.getElementsByTagName('input')[0]);
            log.un('click', onClick);
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
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toBe('div(other)');
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('div')[0]);
            log.un('click', onClick);
        });

        it('xpath - h3-a(title)', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toBe('h3-a(title)');
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('a')[0]);
            log.un('click', onClick);
        });

        it('xpath - a2(link)', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toBe('a2(link)');
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('a')[2]);
            log.un('click', onClick);
        });

        it('xpath - div-span-input(input)', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toBe('div-span-input(input)');
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[2]);
            log.un('click', onClick);
        });

        it('type - btn for default', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toMatch(/\(input\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[2]);
            log.un('click', onClick);
        });

        it('type - link for OP_LOG_LINK', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toMatch(/\(link\)/);
            };
            var el = container.getElementsByTagName('input')[2];
            T.addClass(el, 'OP_LOG_LINK');
            log.on('click', onClick);
            log.click(el);
            log.un('click', onClick);
            T.removeClass(el, 'OP_LOG_LINK');
        });
    });

});
