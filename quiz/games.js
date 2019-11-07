var http = require('http');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jihun311',
  database: 'games'
});
db.connect();

var app = http.createServer(function(request, response) {
  var table = `<table border="1">
                    <th>SUIT</th>
                    <th>RANK</th>`
  db.query(`SELECT * FROM card`, function(err,card) {
    var i = 0;
    while(i < card.length) {
      table = table + `<tr>
                        <td>${card[i].suit}</td>
                        <td>${card[i].rank}</td>
                      </tr>`

      i=i+1;

    }
    table = table + `</table>`
    var template = `
    <html>
      <head>
      <title>CARD</title>
      <meta charset="utf-8">
      </head>
      <body>
        ${table}
      </body>
    </html>
    `;
    response.writeHead(200);
    response.end(template);

  })


});
app.listen(3000);
