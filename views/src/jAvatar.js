'use strict';

const canvasSize = 300;
const iconSize = 60;

function getPixelRatio(context) {
    const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
    return (window.devicePixelRatio || 1) / backingStore;
}
function drawCanvas2Image(canvas, image) {
    // 把 canvas 的图像绘为 canvas img，方便长按保存
    var MIME_TYPE = "image/png";
    var imgURL = canvas.toDataURL(MIME_TYPE);
    image.setAttribute('src', imgURL);
}
function drawIconBorder(ctx, canvasRealWidth, canvasRealHeight, iconRealSize) {
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

function IconsComponent(props) {
    const {canvasRef, imageRef, canvasRealWidth, canvasRealHeight, iconRealSize} = props;
    // const imgFileName = 'icons';
    const iconsGroup = [
        {
            title: '🧑‍🎨 Designer:',
            dirName: 'Designer',
            files: ['Adobe', 'Ae', 'ai', 'Pr']
        },
        {
            title: '🧑‍💻 Front end:',
            dirName: 'FroneEnd',
            files: ['html', 'react', 'vue']
        },
        {
            title: '🧑‍💻 Back end:',
            dirName: 'backEnd',
            files: ['go_gopher', 'haskell', 'java', 'php', 'python', 'r', 'ruby', 'rust']
        },
        {
            title: '🧑‍💼 Office:',
            dirName: 'Office',
            files: ['excel', 'powerpoint', 'word']
        },
        {
            title: '🙋 Other:',
            dirName: 'Other',
            files: ['c4d', 'unity']
        },
        {
            title: '📲 Phone:',
            dirName: 'Phone',
            files: ['android', 'applescript', 'swift']
        }
    ];
    function handleIconClick(e) {
        const imgSrc = e.target.src;
        const canvas = canvasRef.current;
        const image = imageRef.current;
        const ctx = canvas.getContext('2d');
        // 新建 Image 对象
        const img = new Image();
        // 设置 Image src
        img.src = imgSrc;
        // Image 加载完毕后画到 canvas 上
        img.onload = function () {
            drawIconBorder(ctx, canvasRealWidth, canvasRealHeight, iconRealSize);
            ctx.drawImage(img, canvasRealWidth * 0.675, canvasRealHeight * 0.675, iconRealSize, iconRealSize);
            drawCanvas2Image(canvas, image);
        };
    }
    return (
        <div className="icon-banners">
            <h4>请选择你的 Icon Pin 😆:</h4>
            {iconsGroup.map(function (iconItem, index) {
                const {title, dirName, files} = iconItem;
                return (
                    <React.Fragment key={`icon-F-${index}`}>
                        <h4>{title}</h4>
                        <div className="icon-banner">
                            {files.map(function (fileName) {
                                return (
                                    <img
                                        key={`${dirName}/${fileName}`}
                                        src={`${window.PinsImages[fileName]}`}
                                        onClick={handleIconClick}
                                    />
                                );
                            })}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function UploadInputComponent(props) {
    let {switchStatus, setUploadData} = props;

    function onChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            switchStatus(STATUS.CROPPER);
            const dataURL = reader.result;
            setUploadData(dataURL);
        };
    }

    return (
        <div className="form-item">
            <label>🙌 选择头像图片:</label>
            <input type="file" id="avatar" name="avatar" accept="image/*" onChange={onChange} />
        </div>
    );
}

function CropperComponent(props) {
    let { style, cropper, setCroppedImgSrc, switchStatus, uploadData, setCropper } = props;
    const imageRef = React.useRef(null);
    React.useEffect(function() {
        cropper && cropper.destroy();
        const copperImage = imageRef.current;
        copperImage.src = uploadData;
        cropper = new Cropper(copperImage, {
            aspectRatio: 1,
            minContainerWidth: 300,
            minContainerHeight: 300,
            autoCropArea: 1,
            dragMode: 'move',
        });
        setCropper(cropper);
    }, [uploadData])
    function onBtnClick() {
        if (cropper) {
            const imgSrc = cropper.getCroppedCanvas().toDataURL();
            setCroppedImgSrc(imgSrc);
            switchStatus(STATUS.PICK_ICONS);
        }
    }
    return <React.Fragment>
        <div id="cropper-container" style={style}>
            <img id="copper-img" ref={imageRef} />
        </div>
        <div className="cropper-btn" style={style}>
            <button
                className='primary-btn'
                onClick={onBtnClick}
            >💛 完成裁剪 💛</button>
        </div>
    </React.Fragment>
}

function DownLoadBtnComponent(props) {
    function handleBtnClick() {
        const {canvasRef} = props;
        var MIME_TYPE = 'image/png';
        var imgURL = canvasRef.current.toDataURL(MIME_TYPE);
        var dlLink = document.createElement('a');
        dlLink.download = 'JallowPinsAvatar';
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    return (
        <button className="download-btn primary-btn" onClick={handleBtnClick}>
            下载 Jallow Pins 头像
        </button>
    );
}

function CanvasComponent(props) {
    const { imgSrc, switchStatus } = props;
    let canvasRef = React.useRef(null);
    let imageRef = React.useRef(null);
    let [canvasRealWidth, setCanvasRealWidth] = React.useState(0);
    let [canvasRealHeight, setCanvasRealHeight] = React.useState(0);
    let [iconRealSize, setIconRealSize] = React.useState(0);

    React.useEffect(function() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const pixelRatio = getPixelRatio(ctx);
        const canvasRealWidth = canvasSize * pixelRatio;
        const canvasRealHeight = canvasRealWidth; // 正方形
        canvas.width = canvasRealWidth;
        canvas.height = canvasRealHeight;
        const iconRealSize = iconSize * pixelRatio;
        setCanvasRealWidth(canvasRealWidth);
        setCanvasRealHeight(canvasRealHeight);
        setIconRealSize(iconRealSize);
        // 新建 Image 对象
        const img = new Image();
        // 设置 Image src
        img.src = imgSrc;
        // Image 加载完毕后画到 canvas 上
        img.onload = function() {
            // 由于 mobile Orientation 导致的旋转问题。
            window.EXIF.getData(img, function () {
                const orientation = EXIF.getTag(this, "Orientation");
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
            // 把 canvas 的图像绘为 canvas img，方便长按保存
            drawCanvas2Image(canvas, imageRef.current);
        };
    }, [])

    return (
        <React.Fragment>
            <img id="avatar-img" ref={imageRef} />
            <canvas
                id="jallowPinsCanvas"
                width="900"
                height="900"
                ref={canvasRef}
                style={{width: '300px', height: '300px'}}
            ></canvas>
            <div>
                <DownLoadBtnComponent canvasRef={canvasRef} />
                <button
                    className="reupload-btn primary-btn"
                    onClick={function () {
                        switchStatus(STATUS.UPLOAD);
                    }}
                >
                    重新上传
                </button>
            </div>
            <IconsComponent
                canvasRef={canvasRef}
                imageRef={imageRef}
                canvasRealWidth={canvasRealWidth}
                canvasRealHeight={canvasRealHeight}
                iconRealSize={iconRealSize}
            />
        </React.Fragment>
    );
}

const STATUS = {
    UPLOAD: 'UPLOAD',
    CROPPER: 'CROPPER',
    PICK_ICONS: 'PICK_ICONS',
}
class Root extends React.Component {
    constructor(props) {
        super(props);
        this.switchStatus = this.switchStatus.bind(this);
        this.setCropper = this.setCropper.bind(this);
        this.setCroppedImgSrc = this.setCroppedImgSrc.bind(this);
        this.setUploadData = this.setUploadData.bind(this);
    }
    state = {
        status: STATUS.UPLOAD,
        cropper: null,
        imgSrc: '',
        uploadData: ''
    }

    switchStatus(status) {
        this.setState({
            status
        })
    }

    setUploadData(uploadData) {
        this.setState({
            uploadData
        })
    }

    setCroppedImgSrc(imgSrc) {
        this.setState({
            imgSrc
        })
    }

    setCropper(cropper) {
        this.setState({
            cropper
        })
    }

    render() {
        const { status, cropper, imgSrc, uploadData } = this.state;
        switch (status) {
            case STATUS.UPLOAD:
            case STATUS.CROPPER:
                return (
                    <React.Fragment>
                        <UploadInputComponent switchStatus={this.switchStatus} setUploadData={this.setUploadData} />
                        <CropperComponent
                            switchStatus={this.switchStatus}
                            uploadData={uploadData}
                            cropper={cropper}
                            setCropper={this.setCropper}
                            setCroppedImgSrc={this.setCroppedImgSrc}
                            style={status === STATUS.UPLOAD ? {visibility: 'hidden'} : {visibility: 'visible'}}
                        />
                    </React.Fragment>
                );
            case STATUS.PICK_ICONS:
                return <CanvasComponent imgSrc={imgSrc} switchStatus={this.switchStatus} />
            default:
                return null
        }
    }
}

const root = document.querySelector('#root');
ReactDOM.render(React.createElement(Root), root);
