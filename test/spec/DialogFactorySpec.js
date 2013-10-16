    define(function (require) {
        var DialogFactory = require('DialogFactory');
        
        var alertDialog, confirmDialog;

        beforeEach(function () {

            alertDialog = DialogFactory.alert({
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

            confirmDialog = DialogFactory.confirm({
                content: '内容',
                footer: '底部',
                width: '600px',
                title: '标题',
                top: '50px',
                left: '',
                fixed: 1,
                showMask: 1,
                leve: 11
              });
        });


        afterEach(function () {
            alertDialog.dispose();
            confirmDialog.dispose();
        });
      
        describe('基本接口', function () {

            it('event:cancel', function () {
                confirmDialog.on('cancel', function() {
                    expect(1).toBe(1);
                });
                confirmDialog.show();
                confirmDialog.hide();
            });

        });

    });