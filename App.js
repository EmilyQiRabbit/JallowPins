// 引用express
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(require('path').join(__dirname, 'views')));

app.set("views", __dirname);

app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express);

// 监听首页
app.get("/", function(req, res) {
    res.render("views/index.html")
});

// 监听端口
let port = 9000;
app.listen(port, () => {
    console.log("正在监听" + port);
})
