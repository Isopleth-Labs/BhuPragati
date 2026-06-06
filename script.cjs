const fs = require('fs'); const lines = fs.readFileSync('src/homepage/homepage.css', 'utf8').split('\n'); lines.forEach((l, i) => { if(l.includes('340px')) console.log(i + 1, l); })
