var express = require('express')
var app = express()
var template = require('./lib/template.js');
var mysql = require('mysql');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jihun311',
  database: 'final_report'
});

db.connect();

app.use(express.static('public'));

app.get('/', (resquest, response) => {
  db.query(`select year,semester,sum(grade) "sum",round(sum(grade*score)/sum(grade),2) "avg" from grade group by year,semester order by year,semester`, (err, data) => {

    var table = `<table border="1">
                    <th>학기</th>
                    <th>취득 학점</th>
                    <th>평균</th>`;
    var i = 0;
    var all_grade = 0;
    var all_score = 0;

    while (i < data.length) {
      var semester = `${data[i].year} - ${data[i].semester}`;
      table = table + `<tr>
                      <td style="cursor:pointer", onClick="location.href='/page/${semester}'" >${data[i].year} - ${data[i].semester}</td>
                      <td>${data[i].sum}</td>
                      <td>${data[i].avg}</td>
                      </tr>`;
      all_grade = all_grade + data[i].sum;
      all_score = all_score + data[i].avg;
      i = i + 1;
    }
    table = table + `<th>종합</th>
                    <td>${all_grade}</td>
                    <td>${(all_score/data.length).toFixed(2)}</td>`

    table = table + `</table>`

    var html = template.HTML(table);
    response.send(html);
  })
})

app.get('/page/:pageId', (request, response) => {
  db.query(`select * from grade`, (err, data) => {

    var table = template.Table(data, request.params.pageId);
    var html = template.HTML(table);

    response.writeHead(200);
    response.end(html);
  })
})

app.get('/input', (request, response) => {
  var tem = `
    <form action="/input_process" method="post">
      <p><input type="text" name="year" placeholder="년도"></p>
      <p><input type="text" name="semester" placeholder="학기"></p>
      <p><input type="text" name="name" placeholder="괴목명"></p>
      <p><input type="text" name="grade" placeholder="학점"></p>
      <p><input type="text" name="score" placeholder="성적"></p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  var html = template.HTML(tem);
  response.writeHead(200);
  response.end(html);
})

app.post('/input_process', (request, response) => {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`
          INSERT INTO grade VALUES(?, ?, ?, ?, ?)`,
      [post.year, post.semester, post.name, post.grade, post.score],
      function(error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, {
          Location: `/?id=${post.year} - ${post.semester}`
        });
        response.end();
      }
    )
  });
})

app.get('/delete', (request, response) => {
  var tem = `
      <form action="/delete_process" method="post">
        <p><input type="text" name="name" placeholder="괴목명"></p>
        <p>
          <input type="submit">
        </p>
      </form>
    `
  var html = template.HTML(tem);
  response.writeHead(200);
  response.end(html);
})



app.post('/delete_process', (request, response) => {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`DELETE FROM grade WHERE name=?`, [post.name],
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
})

app.get('/update', (request, response) => {
  var tem = `
    <form action="/update_process" method="post">
      <p><input type="text" name="year" placeholder="년도"></p>
      <p><input type="text" name="semester" placeholder="학기"></p>
      <p><input type="text" name="name" placeholder="괴목명"></p>
      <p><input type="text" name="grade" placeholder="학점"></p>
      <p><input type="text" name="score" placeholder="성적"></p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  var html = template.HTML(tem);
  response.writeHead(200);
  response.end(html);
})

app.post('/update_process', (request, response) => {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query('UPDATE grade SET year=?, semester=?, grade=?, score=? where name = ?',
      [post.year, post.semester, post.grade, post.score, post.name] ,
      function(error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, {
          Location:  `/?id=${post.year} - ${post.semester}`
        });
        response.end();
      }
    )
  });
})


/**
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == '/') {
    if (queryData.id === undefined) {
      db.query(`select year,semester,sum(grade) "sum",round(sum(grade*score)/sum(grade),2) "avg" from grade group by year,semester order by year,semester`, (err, data) => {

        var table = `<table border="1">
                        <th>학기</th>
                        <th>취득 학점</th>
                        <th>평균</th>`;
        var i = 0;
        var all_grade = 0;
        var all_score = 0;

        while (i < data.length) {
          var semester = `${data[i].year} - ${data[i].semester}`;
          table = table + `<tr>
                          <td style="cursor:pointer", onClick="location.href='/?id=${semester}'" >${data[i].year} - ${data[i].semester}</td>
                          <td>${data[i].sum}</td>
                          <td>${data[i].avg}</td>
                          </tr>`;
          all_grade = all_grade + data[i].sum;
          all_score = all_score + data[i].avg;
          i = i + 1;
        }
        table = table + `<th>종합</th>
                        <td>${all_grade}</td>
                        <td>${(all_score/data.length).toFixed(2)}</td>`

        table = table + `</table>`

        var html = template.HTML(table);
        response.writeHead(200);
        response.end(html);
      })
    } else {
      db.query(`select * from grade`, (err, data) => {

        var table = template.Table(data, queryData.id);
        var html = template.HTML(table);

        response.writeHead(200);
        response.end(html);
      })
    }
  } else if (pathname === '/input') {
    var tem = `
        <form action="/input_process" method="post">
          <p><input type="text" name="year" placeholder="년도"></p>
          <p><input type="text" name="semester" placeholder="학기"></p>
          <p><input type="text" name="name" placeholder="괴목명"></p>
          <p><input type="text" name="grade" placeholder="학점"></p>
          <p><input type="text" name="score" placeholder="성적"></p>
          <p>
            <input type="submit">
          </p>
        </form>
      `
    var html = template.HTML(tem);
    response.writeHead(200);
    response.end(html);
  } else if (pathname === '/input_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`
          INSERT INTO grade VALUES(?, ?, ?, ?, ?)`,
        [post.year, post.semester, post.name, post.grade, post.score],
        function(error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {
            Location: `/?id=${post.year} - ${post.semester}`
          });
          response.end();
        }
      )
    });
  } else if (pathname === '/delete') {
    var tem = `
        <form action="/delete_process" method="post">
          <p><input type="text" name="name" placeholder="괴목명"></p>
          <p>
            <input type="submit">
          </p>
        </form>
      `
    var html = template.HTML(tem);
    response.writeHead(200);
    response.end(html);
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`DELETE FROM grade WHERE name=?`, [post.name],
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
**/

app.listen(3000);
