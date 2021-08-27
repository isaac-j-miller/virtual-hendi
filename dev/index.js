const express = require("express");
const fs = require("fs")
const path = require("path");
const { promisify } = require('util');

const exec = promisify(require('child_process').exec)
const app = express();

const rootDir = process.env["VH_ROOT"];
console.log(`Using rootDir`, rootDir)
const buildDir = path.join(rootDir, "front/build")
const interpolatorPath = path.join(rootDir, "interpolator/cli.py")

app.get('/', function(req, res, next) {
    res.sendFile(path.join(buildDir, "index.html"));
  });

app.get("/interpolator/:temperature/:min/:max", (req, res) =>{
    const {temperature, min, max} = req.params;
    console.log("Received request to interpolate with the following params:", {temperature, min, max});
    const cmdToUse = `python3 ${[interpolatorPath, temperature, min, max, buildDir].join(" ")}`
    console.log(`Executing \`${cmdToUse}\``)
    exec(cmdToUse).then(r=>{
        if(r.stderr.length > 0) {
            console.error(r.stderr)
            res.status(500),
            res.send({
                error: r.stderr
            })
            return;
        }
        const outputLines = r.stdout.split("\n").filter(line=>!!line);
        const finalLine = outputLines[outputLines.length -1]
        const parsed = JSON.parse(finalLine);
        parsed.headers = JSON.parse(parsed.headers)
        parsed.body = JSON.parse(parsed.body)
        console.debug(`Received output from interpolator script: ${JSON.stringify(parsed, null, 2)}`);
        Object.entries(parsed.headers).forEach(([k,v])=>{
            res.setHeader(k, v)
        })
        res.status(parsed.statusCode)
        res.send(parsed.body)
    }).catch(e=>{
        console.error(e)
        res.status(500);
        res.send({
            "error": e
        })
    })
})

app.get("/virtual-hendi/**", (req, res) => {
    const p = decodeURI(req.url)
    const filePath = path.join(buildDir, path.relative("/virtual-hendi", p))
    res.sendFile(filePath)
})
app.get("/**", (req, res) => {
    const p = decodeURI(req.url)
    const filePath = path.join(buildDir, p)
    console.log(`GET ${p} -> ${filePath}`)
    res.sendFile(filePath)
})
console.log("listening on http://localhost:3000")
app.listen(3000);