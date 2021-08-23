var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../..", "front", "build", "index.html"));
});

router.get('/health', (req, res) => {
  res.send({healthy: true})
})

module.exports = router;
