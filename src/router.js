const Router = require("express").Router;
const router = new Router();
const multer = require("multer");


const { getClassification, fileUpload } = require("./controller");

console.log("Router file loading");

// Set up Multer storage engine to store in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

//Setup Multer to store fily locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//handle upload
router.post("/upload", upload.single('file'), (req, res) => {
  console.log("/upload");
  // console.log("Request object: ",req);
  console.log("Request file ",req.file);

  res.send(fileUpload(req.file));
});


//handles initial request
router.post("/getClassification", (req, res) => {
  console.log("/getClassification");
  res.send(getClassification(req.body));
});

module.exports = router;
