var canvasSize = 300;
var iconSize = 60;
var canvas = document.getElementById("jallowPinsCanvas");
var copperImage = $("#copper-img");
var image = $("#avatar-img");
var preview = $(".previewBoxRound");
var container = $("#cropper-container");
var cropBtn = $(".cropper-btn");
var ctx = canvas.getContext("2d");
var pixelRatio = getPixelRatio(ctx);
var canvasRealWidth = canvasSize * pixelRatio;
var canvasRealHeight = canvasRealWidth; // 正方形
var cropper = null;
canvas.width = canvasRealWidth;
canvas.height = canvasRealHeight;
var iconRealSize = iconSize * pixelRatio;
function drawAvatar(imgSrc) {
    // 新建 Image 对象
    var img = new Image();
    // 设置 Image src
    img.src = imgSrc;
    // Image 加载完毕后画到 canvas 上
    img.onload = function() {
        // 由于 mobile Orientation 导致的旋转问题。
        window.EXIF.getData(img, function () {
            var orientation = EXIF.getTag(this, "Orientation");
            // ctx.save();
            // ctx.arc(
            //     canvasRealWidth / 2,
            //     canvasRealHeight / 2,
            //     canvasRealWidth / 2,
            //     0,
            //     2 * Math.PI
            // );
            // ctx.clip();
            switch (orientation) {
                case 3:
                    ctx.rotate(Math.PI);
                    ctx.drawImage(
                        img,
                        -canvasRealWidth,
                        -canvasRealHeight,
                        canvasRealWidth,
                        canvasRealHeight
                    );
                    ctx.rotate(-Math.PI);
                    break;
                case 6:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.drawImage(
                        img,
                        0,
                        -canvasRealHeight,
                        canvasRealWidth,
                        canvasRealHeight
                    );
                    ctx.rotate(-0.5 * Math.PI);
                    break;
                case 8:
                    ctx.rotate((3 * Math.PI) / 2);
                    ctx.drawImage(
                        img,
                        canvasRealWidth,
                        0,
                        canvasRealWidth,
                        canvasRealHeight
                    );
                    // 必须旋转回来！
                    ctx.rotate(-(3 * Math.PI) / 2);
                    break;
                default:
                    ctx.drawImage(img, 0, 0, canvasRealWidth, canvasRealHeight);
                    break;
            }
        });
        drawCanvas2Image();
        changeElementVisible(image, true);
        changeIconBannerVisible(true);
        changeDownloadBtnVisible(true);
    };
}
function drawCanvas2Image() {
    // 把 canvas 的图像绘为 canvas img，方便长按保存
    var MIME_TYPE = "image/png";
    var imgURL = canvas.toDataURL(MIME_TYPE);
    image.attr('src', imgURL);
}
function drawIconBorder() {
    ctx.beginPath();
    ctx.arc(
        canvasRealWidth * 0.675 + iconRealSize / 2,
        canvasRealHeight * 0.675 + iconRealSize / 2,
        iconRealSize / 2 + 8,
        0,
        2 * Math.PI
    );
    ctx.fillStyle = "#fff";
    ctx.fill();
}
function drawIcon(imgSrc) {
    // 新建 Image 对象
    var img = new Image();
    // 设置 Image src
    img.src = imgSrc;
    // Image 加载完毕后画到 canvas 上
    img.onload = function() {
        drawIconBorder();
        ctx.drawImage(
            img,
            canvasRealWidth * 0.675,
            canvasRealHeight * 0.675,
            iconRealSize,
            iconRealSize
        );
        drawCanvas2Image();
    };
}
function changeElementVisible(ele, visible) {
    ele && ele.css('display', visible ? "block" : "none");
}
function changeIconBannerVisible(visible) {
    $(".icon-banners").css("visibility", visible ? "visible" : "hidden");
    $(".icon-banners").css("height", visible ? "auto" : "0");
}
function changeDownloadBtnVisible(visible) {
    $(".download-btn").css("visibility", visible ? "visible" : "hidden");
}
function inputChangeListener() {
    $("#avatar").change(function (e) {
        if (cropper) {
            cropper.destroy();
            changeElementVisible(copperImage, false);
            changeElementVisible(preview, false);
            changeElementVisible(container, false);
            changeElementVisible(cropBtn, false);
            changeElementVisible(image, false);
            changeIconBannerVisible(false);
            changeDownloadBtnVisible(false);
        }
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            changeElementVisible(copperImage, true);
            changeElementVisible(preview, true);
            changeElementVisible(container, true);
            changeElementVisible(cropBtn, true);
            var dataURL = reader.result;
            copperImage[0].src = dataURL;
            cropper && cropper.destroy();
            cropper = new Cropper(copperImage[0], {
                aspectRatio: 1,
                minContainerWidth: 300,
                minContainerHeight: 300,
                autoCropArea: 1,
                dragMode: 'move',
                // preview: document.querySelector('.previewBoxRound'),
            });
            

        }
    });
}
function iconClickListener() {
    $(".icon-banners").click(function (e) {
        if (e.target.nodeName === "IMG") {
            drawIcon(e.target.src, pixelRatio);
        }
    });
}
function cropperBtnClickListener() {
    cropBtn.on('click', function (e) {
        if (cropper) {
            var dataUrl = cropper.getCroppedCanvas().toDataURL();
            drawAvatar(dataUrl);
            changeElementVisible(preview, false);
            changeElementVisible(container, false);
            changeElementVisible(cropBtn, false);
        }
        console.log('cropperBtnClickListener');
    });
}
function getPixelRatio(context) {
    var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
    return (window.devicePixelRatio || 1) / backingStore;
}
function downloadCanvasImg() {
    var MIME_TYPE = "image/png";
    var imgURL = canvas.toDataURL(MIME_TYPE);
    var dlLink = document.createElement("a");
    dlLink.download = "JallowPinsAvatar";
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [
        MIME_TYPE,
        dlLink.download,
        dlLink.href,
    ].join(":");

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}
function downloadBtnListener() {
    $(".download-btn").click(downloadCanvasImg);
}
/* ～～～～～ main ～～～～～ */
jQuery(function() {
    console.log("document ready");
    inputChangeListener();
    iconClickListener();
    cropperBtnClickListener();
    downloadBtnListener();
})
