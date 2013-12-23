define(function (require) {
    var lib = require('ui/lib');
    var ScrollBar = require('ui/ScrollBar');
    
    var scrollbar;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="ecl-ui-scrollbar" class="ecl-ui-scrollbar">'
                +   '<div class="ecl-ui-scrollbar-track">'
                +     '<i id="ecl-ui-scrollbar-thumb" '
                +     'class="ecl-ui-scrollbar-thumb"></i>'
                +   '</div>'
                +   '<div class="ecl-ui-scrollbar-panel" style="width:490px">'
                +     '<div id="ecl-ui-scrollbar-main" style="width:490px">'
                +       '<p style="background:#CCC">'
                +       '猪!你的鼻子有两个孔,感冒时的你还挂着鼻涕牛牛. '
                +       '猪!你有着黑漆漆的眼,望呀望呀望也看不到边. '
                +       '猪!你的耳朵是那么大,呼扇呼扇也听不到我在骂你傻. '
                +       '猪!你的尾巴是卷又卷,原来跑跑跳跳还离不开它 '
                +       '哦~~~ '

                +       '猪头猪脑猪身猪尾(yi)巴 '
                +       '从来不挑食的乖娃娃 '
                +       '每天睡到日晒三杆后 '
                +       '从不刷牙从不打架 '

                +       '猪!你的肚子是那么鼓,一看就知道受不了生活的苦 '
                +       '猪!你的皮肤是那么白,上辈子一定投在那富贵人家 '
                +       '哦~~~ '
                +     '</p>'
                +       '传说你的祖先有八钉耙,算命先生说他命中犯桃花 '
                +       '见到漂亮姑娘就嘻嘻哈哈 '
                +       '不会脸红不会害怕 '

                +       '猪头猪脑猪身猪尾(yi)巴 '
                +       '从来不挑食的乖娃娃 '
                +       '每天睡到日晒三杆后 '
                +       '从不刷牙从不打架哦~~~ '
                +       '传说你的祖先有八钉耙,算命先生说他命中犯桃花 '
                +       '见到漂亮姑娘就嘻嘻哈哈 '
                +       '不会脸红不会害怕 '
                +       '你很象她'

                +       '猪!你的鼻子有两个孔,感冒时的你还挂着鼻涕牛牛. '
                +       '猪!你有着黑漆漆的眼,望呀望呀望也看不到边. '
                +       '猪!你的耳朵是那么大,呼扇呼扇也听不到我在骂你傻. '
                +       '猪!你的尾巴是卷又卷,原来跑跑跳跳还离不开它 '
                +       '哦~~~ '

                +       ' 猪头猪脑猪身猪尾(yi)巴 '
                +       '从来不挑食的乖娃娃 '
                +       '每天睡到日晒三杆后 '
                +       '从不刷牙从不打架 '

                +       '猪!你的肚子是那么鼓,一看就知道受不了生活的苦 '
                +       '猪!你的皮肤是那么白,上辈子一定投在那富贵人家 '
                +       '哦~~~ '

                +       '传说你的祖先有八钉耙,算命先生说他命中犯桃花 '
                +       '见到漂亮姑娘就嘻嘻哈哈 '
                +       '不会脸红不会害怕 '

                +       '猪头猪脑猪身猪尾(yi)巴 '
                +       '从来不挑食的乖娃娃 '
                +       '每天睡到日晒三杆后 '
                +       '从不刷牙从不打架哦~~~ '
                +       '传说你的祖先有八钉耙,算命先生说他命中犯桃花 '
                +       '见到漂亮姑娘就嘻嘻哈哈 '
                +       '不会脸红不会害怕 '
                +       '你很象她'
                +     '</div>'
                +   '</div>'
                + '</div>'
        );

        lib.g('ecl-ui-scrollbar-main').style.width = '490px';


        scrollbar = new ScrollBar({
           main: lib.g('ecl-ui-scrollbar-main'),
           thumb: lib.g('ecl-ui-scrollbar-thumb'),
           disabled: 0
        });
        scrollbar.render();               
        

    });


    afterEach(function () {
        scrollbar.dispose();
        document.body.removeChild(lib.g('ecl-ui-scrollbar'));
    });
  
    describe('基本接口', function () {


        it('控件类型', function () {
            expect(scrollbar.type).toBe('ScrollBar');
        });

        it('scrollTo', function () {
            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(scrollSize);

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );
        });

        it('onchange', function () {
            var a = 1;
            scrollbar.on('change', scrollbar.options.onChange = function(e) {
                expect(a).toBe(1);
                expect(e.position >=0).toBe(true);
                expect(e.position <=1).toBe(true);
            });
        });

        it('refresh', function () {

            lib.g('ecl-ui-scrollbar-main').innerHTML += 
                lib.g('ecl-ui-scrollbar-main').innerHTML;

            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.refresh();

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(scrollSize);

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );

        });

        it('disable不影响接口调用', function () {

            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.scrollTop).toBe(0);

            scrollbar.disable();
            scrollbar.scrollTo(0.5);
            //disable 不影响接口调用
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );

        });

    });

});