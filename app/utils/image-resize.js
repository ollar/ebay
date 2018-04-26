export default function imageResize(
    image,
    options = { maxWidth: 800, maxHeight: 600 }
) {
    const promise = new Promise((yea, nah) => {
        var img = new Image();
        var imageUrl = URL.createObjectURL(image);

        const IMG_MAX_WIDTH = options.maxWidth;
        const IMG_MAX_HEIGHT = options.maxHeight;

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

            return yea({
                type: image.type,
                name: image.name,
                lastModified: image.lastModified,
                lastModifiedDate: image.lastModifiedDate,
                width: image_width,
                height: image_height,
                base64: oc.toDataURL(),
            });
        };

        img.src = imageUrl;
    });

    return promise;
}
