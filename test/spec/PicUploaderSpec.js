    define(function (require) {
        var PicUploader = require('PicUploader');
        var lib = require('lib');
        var picUploader;
        var removeEventCount=0;

        beforeEach(function () {

            document.body.insertAdjacentHTML(
                'beforeEnd',
                '<div id="picUploaderContainer"></div>'
            );

            picUploader = new PicUploader({
                main: lib.g('picUploaderContainer')
            });
            picUploader.render();

        });


        afterEach(function () {
            picUploader.dispose();
        });
      
        describe('基本接口', function () {


            it('getfilelist', function () {
                var files = picUploader.getFileList();

                expect(files.length).toBe(0);
            });

            it('remove', function () {

                picUploader.remove('xxxxxx', 
                    function(removePath, filePath,  index) {
                        index;
                        expect(removePath).toBeTruthy();
                    }
                );

            });

            it('event:remove', function () {

                picUploader.on('remove', function() {
                    removeEventCount++;
                });

                picUploader.on('dispose', function() {
                    //expect(removeEventCount).toBe(1);
                });

                var closeBtn = lib.q(
                    'ecl-ui-picuploader-close', 
                    picUploader.options.main
                )[0];

                expect(closeBtn).toBeTruthy();

                // lib.fire(
                //     closeBtn, 
                //     'click'
                // );

            });


        });





    });