export default function imageResize(image) {
    const promise = new Promise((yea, nah) => {
        var img = new Image();
        var imageUrl = URL.createObjectURL(image);

        const IMG_MAX_WIDTH = 800;
        const IMG_MAX_HEIGHT = 600;

        if (image.type.indexOf('image') < 0) {
            return nah();
        }

        img.onload = function() {
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            var image_width = img.width,
                image_height = img.height;

            if (img.width >= img.height) {
                var imgRatioW = img.width / IMG_MAX_WIDTH;
                image_width = IMG_MAX_WIDTH;
                image_height = img.height / imgRatioW;
            } else if (img.height > img.width) {
                var imgRatioH = img.height / IMG_MAX_HEIGHT;
                image_width = img.width / imgRatioH;
                image_height = IMG_MAX_HEIGHT;
            }

            oc.width = image_width;
            oc.height = image_height;

            octx.drawImage(img, 0, 0, oc.width, oc.height);

            return oc.toBlob(
                blob => {
                    Object.defineProperties(blob, {
                        type: {
                            value: image.type,
                            writable: true,
                        },
                        name: {
                            writable: true,
                            value: image.name,
                        },
                        lastModified: {
                            writable: true,
                            value: image.lastModified,
                        },
                        lastModifiedDate: {
                            writable: true,
                            value: image.lastModifiedDate,
                        },
                        width: {
                            writable: false,
                            value: image_width,
                        },
                        height: {
                            writable: false,
                            value: image_height,
                        },
                        base64: {
                            writable: true,
                            value: oc.toDataURL(),
                        },
                    });

                    return yea(blob);
                },
                {
                    type: image.type,
                }
            );
        };

        img.src = imageUrl;
    });

    return promise;
}
