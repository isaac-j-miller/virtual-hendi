var express = require('express');
var path = require('path');
const fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/:temperature/:min/:max', function(req, res, next) {
  const { temperature, min, max }= req.params;
  let tempToUse = temperature;
  if (temperature <= 13.5) {
      tempToUse = 13.5
  }
  else if (temperature <= 16) {
      tempToUse = 16;
  }
  else if (temperature <= 18) {
      tempToUse = 18;
  }
  else {
      tempToUse = 20;
  }
  const fileName = `OCS_${tempToUse}K.dat`
  const filePath = path.join(__dirname,'..', 'spectra',fileName);
  fs.readFile(filePath,(err, rawData) => {
    if(err) {
        console.log(err);
        res.render('error');
    }
    const lines = rawData.toString('utf-8').split('\n');
    const data = lines.map(line =>{
        const d = line.replace('\r','').split('\t');
        return {
            x:Number(d[0]),
            y:Number(d[1]),
        }
    });
    const filteredData = {
        data: 'Wavenumber (cm-1),Intensity\n' + data.filter(d=>(d.x>=min && d.x<=max)).map(d=>{return `${d.x},${d.y}`}).join('\n'),
    }
    res.send(JSON.stringify(filteredData));
  });
  
});

module.exports = router;
