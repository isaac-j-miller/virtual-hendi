var express = require('express');
var path = require('path');
const fs = require('fs');
var router = express.Router();
const {promisify} = require('util');
const exec = promisify(require("child_process").exec)

/* GET home page. */
router.get('/:temperature/:min/:max', async function(req, res, next) {
  const { temperature, min, max }= req.params;
  const temperatures = [
      13.5,
      16,
      18,
      20
  ]
  const fileName = `OCS_${temperature}K.dat`
  const filePath = path.join(__dirname,'..', 'spectra','generated',fileName);
  if( !fs.existsSync(filePath) ) {
    let lower_temp, upper_temp;
    let lower_f, upper_f;
    for (let i = 0; i < temperatures.length-1; i++) {
        const temp1= temperatures[i];
        const temp2= temperatures[i+1];
        if (temperature>temp1 && temperature<temp2) {
            lower_temp = temp1;
            lower_f = path.join(__dirname,'..', 'spectra','generated',`OCS_${temp1}K.dat`);
            upper_temp = temp2;
            upper_f = path.join(__dirname,'..', 'spectra','generated',`OCS_${temp2}K.dat`);
            break;
        }
    }
    const interpolator = `${process.env["VH_ROOT"]}/back/src/python/interpolate.py`
    const cmd = `python3 ${interpolator} "${lower_f}" ${lower_temp} "${upper_f}" ${upper_temp} ${temperature} ${path.join(__dirname,'..', 'spectra','generated',`OCS_${temperature}K.dat`)}`;
    try{
        await exec(cmd);
    } catch(err) {
        console.log(err);
    }
  }
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
