const Router = require("express").Router;
const router = new Router();
const multer = require("multer");


const { summarizer } = require("./controller");

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
  // console.log("Request file ", req.file);

  summarizer(req.file)
    .then((data) => {
      console.log("Summary object: ", data);
      res.send(data);
    })
    .catch((err) => {
      console.error("Error summarizing file:", err);
      res.status(500).send("Error summarizing file");
    });

  // res.send(fileUpload(req.file));
});


module.exports = router;
