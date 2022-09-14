const multer = require('multer');
const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');


app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, './upload/')));

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'upload',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now()
        + path.extname(file.originalname))
      // file.fieldname is name of the field (image)
      // path.extname get the uploaded file extension
    }
  });
  const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error('Please upload a Image'))
      }
      cb(undefined, true)
    }
  })

  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './upload');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  




  app.post('/uploadImage', imageUpload.single('image'), (req, res) => {
    try {
      return res.json({ success: 200, url: `http://13.234.48.21:3002/${req.file.filename}` })//http://13.234.48.21:3001/
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })
  app.post('/array/uploadImage',imageUpload.array('image',3), (req, res) => {
    try {
       let image = [];
       req.files.map((url)=>{
        image = [...image,"http://13.234.48.21:3002/"+url.filename]
       })
      return res.json({ success: 200, images:image })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })


  app.listen(3002,()=>{
    console.log("listening on ")
  })