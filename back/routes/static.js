var express = require('express');
var path = require('path');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  const split = req.baseUrl.split('/');
  const index = split.indexOf("virtual-hendi");
  const p = split.slice(index+1, split.length-1).join('/');
  const last = decodeURIComponent(split[split.length-1]);
  const newPath = path.join(__dirname, "../..", "front", "build", p, last);
  console.log(newPath);
  res.sendFile(newPath);
});

module.exports = router;
