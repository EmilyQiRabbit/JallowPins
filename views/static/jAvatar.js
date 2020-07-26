var canvasSize = 300;
var iconSize = 60;
var canvas = document.getElementById("jallowPinsCanvas");
var image = $("#avatarImg");
var ctx = canvas.getContext("2d");
var pixelRatio = getPixelRatio(ctx);
var canvasRealWidth = canvasSize * pixelRatio;
var canvasRealHeight = canvasRealWidth; // 正方形
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
      //   canvasRealWidth / 2,
      //   canvasRealHeight / 2,
      //   canvasRealWidth / 2,
      //   0,
      //   2 * Math.PI
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
    changeCanvasImageVisible(true);
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
function changeCanvasImageVisible(visible) {
  // canvas.style.display = visible ? "block" : "none";
  image.css('display', visible ? "block" : "none");
}
function changeIconBannerVisible(visible) {
  $(".divider").css("visibility", visible ? "visible" : "hidden");
  $(".icon-banners").css("visibility", visible ? "visible" : "hidden");
  $(".icon-banners").css("height", visible ? "auto" : "0");
}
function changeDownloadBtnVisible(visible) {
  $(".download-btn").css("visibility", visible ? "visible" : "hidden");
}
function inputChangeListener() {
  $("#avatar").change(function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      drawAvatar(e.target.result);
    };
  });
}
function iconClickListener() {
  $(".icon-banners").click(function (e) {
    if (e.target.nodeName === "IMG") {
      drawIcon(e.target.src, pixelRatio);
    }
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
$(document).ready(function () {
  console.log("(｡･ω･｡)ﾉ💛～ document ready");
  inputChangeListener();
  iconClickListener();
  downloadBtnListener();
});
