const express = require("express");
const router = express.Router();
const Ficheiro = require("../controllers/ficheiros");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/files/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("ficheiro"), Ficheiro.Upload);
router.get("/:id", Ficheiro.GET);
router.get("/download/:id", Ficheiro.Download);

module.exports = router;
