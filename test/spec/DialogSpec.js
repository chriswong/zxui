    define(function (require) {
        var Dialog = require('Dialog');
        
        var dialog;

        beforeEach(function () {

            dialog = new Dialog({
                content: '内容',
                footer: '底部',
                width: '600px',
                title: '标题',
                top: '50px',
                left: '',
                fixed: 1,
                showMask: 1,
                leve: 10
              });
            dialog.render();
            
        });


        afterEach(function () {
            
        });
      
        describe('基本接口', function () {

            it('控件类型', function () {

                expect(dialog.type).toBe('Dialog');

            });

            it('event:show', function () {
                dialog.on('show', function() {
                    expect(dialog.main.style.display).toBe('');
                });
                dialog.show();
            });

            it('event:hide', function () {
                dialog.on('hide', function() {
                    expect(dialog.main.style.display).toBe('none');
                });
                dialog.hide();
            });

            it('title check', function () {
                expect(dialog.getHeaderDom().innerHTML).toBe('标题');
                dialog.setTitle('标题1');
                expect(dialog.getHeaderDom().innerHTML).toBe('标题1');
            });

            it('content check', function () {
                expect(dialog.getBodyDom().innerHTML).toBe('内容');
                dialog.setContent('内容1');
                expect(dialog.getBodyDom().innerHTML).toBe('内容1');
            });

            it('footer check', function () {
                expect(dialog.getFooterDom().innerHTML).toBe('底部');
                dialog.setFooter('底部1');
                expect(dialog.getFooterDom().innerHTML).toBe('底部1');
            });

            it('mask check', function () {
                expect(dialog.mask).toBeTruthy();
            });

            it('event:dispose', function () {
                dialog.on('dispose', function() {
                    expect(dialog.main).toBeFalsy();
                });
                dialog.dispose();
            });

        });

    });