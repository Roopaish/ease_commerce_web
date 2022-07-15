const https = require('https');

https.get('https://www.brainyquote.com/topics/hacker', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  const data = [];
  res.on('data', (d) => {
    data.push(d);
  });

  res.on('end', ()=>{

        const result = data
        .join("")
        .match(/(?<=title="(view quote|view author)">)(.*?)(?=<\/a>)/g)

        console.log(result);
  });

}).on('error', (e) => {
  console.error(e);
});