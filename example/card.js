var http = require('http');
var mysql = require('mysql');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jihun311',
  database: 'games'
});
db.connect();

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == '/') {
    var table = `<table border="1">
                    <th>ID</th>
                    <th>SUIT</th>
                    <th>RANK</th>`
    db.query(`SELECT * FROM card2`, function(err, card2) {
      var i = 0;
      while (i < card2.length) {
        table = table + `<tr>
                        <td>${card2[i].id}</td>
                        <td>${card2[i].suit}</td>
                        <td>${card2[i].rank}</td>
                      </tr>`

        i = i + 1;

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
        <a href="/create">create</a>
        <a href="/delete">delete</a>
      </body>
    </html>
    `;
      response.writeHead(200);
      response.end(template);

    })
  } else if (pathname === '/create') {
    db.query(`SELECT * FROM card2`, function(err, card2) {
      var html = `
      <html>
        <head>
        <title>CARD</title>
        <meta charset="utf-8">
        </head>
        <body>
        <form action="/create_process" method="post">
          <p><input type="text" name="id" placeholder="id"></p>
          <p><input type="text" name="suit" placeholder="suit"></p>
          <p><input type="text" name="rank" placeholder="rank"></p>
          <p>
            <input type="submit">
          </p>
        </form>
        </body>
      </html>
        `;
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`
          INSERT INTO card2 VALUES(?, ?, ?)`,
        [post.id, post.suit, post.rank],
        function(error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {
            Location: `/`
          });
          response.end();
        }
      )
    });
  } else if (pathname === '/delete') {
    db.query(`SELECT * FROM card2`, function(error, card) {
      var html = `
          <!doctype html>
          <html>
              <head>
                  <title>card</title>
              </head>
              <body>
        <form action="/delete_process" method="post">
          <p><input type="text" name="id" placeholder="id"></p>
          <p>
            DELETE<input type="submit">
          </p>
          </form>
              </body>
          </html>
        `;
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`DELETE FROM card2 WHERE id=?`, [post.id],
        function(error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {
            Location: `/`
          });
          response.end();
        })
    });
  }
});
app.listen(3000);
