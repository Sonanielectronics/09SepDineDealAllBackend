const  express = require("express");
const cors = require('cors');
const  app = express();

app.use(cors());

require("./db/conn");
const router = require('./router/router');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var path = require("path");

app.use(express.static(path.join(__dirname, "../public"))); 

require("dotenv").config();

const  port = process.env.PORT || 3500;

const morgan = require("morgan");
app.use(morgan("dev"));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use('/', router);

app.listen(port, () => {
console.log(`Server running at ` + port);
});