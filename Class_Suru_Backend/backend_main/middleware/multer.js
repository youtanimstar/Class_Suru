import multer from "multer";
import fs from "fs";

// Ensure the tmp directory exists
const tmpDir = "tmp/";
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const storage = multer.diskStorage({
  filename: function(req,file,cb)
  {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});




const upload = multer({ storage: storage });


export { upload };