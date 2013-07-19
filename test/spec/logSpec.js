define(function (require) {

    var lib = require('lib');
    var log = require('log');
    

    var container;

    beforeEach(function () {
        log.start();
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
                +       '<img width="270" height="129" title="baidu"'
                +           ' src="http://www.baidu.com/img/bdlogo.gif">'
                +   '</a>'
                +   '<a href="http://www.baidu.com/?a=b&amp;c=d" '
                +       'target="_blank" data-click="{x:4, y: 3}">'
                +       'baidu - 配置x=4, y=3'
                +   '</a>'
                +   '<span class="OP_LOG_OTHERS"><em>other</em></span>'
                +   '<span class="OP_LOG_BTN">N/A'
                +       '<input type="password" value="password">'
                +   '</span>'
                +   '<span>N/A'
                +       '<input type="password" value="password">'
                +   '</span>'
                +   '<span data-click="">abc'
                +       '<button class="OP_LOG_OTHERS">button</button>'
                +   '</span>'
                +   '<button>button</button>'
                +   '<select><option value="1" selected>1</option></select>'
                +   '<p data-click="abc"></p>'
                + '</div>'
        );
        container = T.g('logContainer');
    });

    afterEach(function () {
        log.stop();
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
            lib.fire(container.getElementsByTagName('input')[1], 'click');
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
            lib.fire(container.getElementsByTagName('input')[2], 'click');
            log.un('click', onClick);
        });

        it('从配置继承', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.foo).toBe('bar');
            };
            log.config({data: {foo: 'bar'}});
            log.on('click', onClick);
            lib.fire(container.getElementsByTagName('div')[0], 'click');
            log.un('click', onClick);
        });

        it('非法的data-click', function () {
            var onClick = function (json) {
                var data = json.data;
                expect(data.abc).toBe('');
            };
            log.on('click', onClick);
            lib.fire(container.getElementsByTagName('p')[0], 'click');
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

        it('title - from img[title]', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe(json.target.title);
                expect(json.data['rsv_xpath']).toBe('a-img(link)');
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('img')[0]);
            log.un('click', onClick);
        });

        it('title - from a.innerHTML with img', function () {
            var target = container.getElementsByTagName('img')[0];
            var title = target.title;
            var onClick = function (json) {
                expect(json.data.title).not.toBe(title);
                expect(json.data['rsv_xpath']).toBe('a-img(link)');
            };
            log.on('click', onClick);
            target.title = '';
            log.click(target);
            log.un('click', onClick);
            target.title = title;
        });

        it('title - select', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe(json.target.value);
                expect(json.data['rsv_xpath']).toMatch(/\(input\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('select')[0]);
            log.un('click', onClick);
        });

        it('title - password(btn)', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe(json.target.parentNode.innerHTML);
                expect(json.data['rsv_xpath']).toMatch(/\(btn\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[3]);
            log.un('click', onClick);
        });

        it('title - password(input)', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe('');
                expect(json.data['rsv_xpath']).toMatch(/\(input\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('input')[4]);
            log.un('click', onClick);
        });

        it('title - button', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe(json.target.innerHTML);
                expect(json.data['rsv_xpath']).toMatch(/\(input\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('button')[1]);
            log.un('click', onClick);
        });

        it('title - span-button', function () {
            var onClick = function (json) {
                expect(json.data.title).toBe(json.target.innerHTML);
                expect(json.data['rsv_xpath']).toMatch(/\(others\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('button')[0]);
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

        it('type - other with OP_LOG_OTHERS class', function () {
            var onClick = function (json) {
                expect(json.data['rsv_xpath']).toMatch(/\(others\)/);
            };
            log.on('click', onClick);
            log.click(container.getElementsByTagName('em')[0]);
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
