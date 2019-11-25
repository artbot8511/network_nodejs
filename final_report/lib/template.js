module.exports = {

  Table: function(grade, query) {
    var table = `<table border="1">
                    <th>학기</th>
                    <th>과목명</th>
                    <th>학점</th>
                    <th>성적</th>`
    var i = 0;
    var all_grade = 0;
    var all_score = 0;
    while (i < grade.length) {
      var semester = `${grade[i].year} - ${grade[i].semester}`;
      if (semester == query) {
        table = table + `<tr>
                                      <td>${grade[i].year} - ${grade[i].semester}</td>
                                      <td>${grade[i].name}</td>
                                      <td>${grade[i].grade}</td>
                                      <td>${grade[i].score}</td>
                                    </tr>`;

        all_grade = all_grade + grade[i].grade;
        all_score = all_score + grade[i].score * grade[i].grade;
      }
      i = i + 1;
    }
    table = table + `<tr>
                                    <td> </td>
                                    <td>최종 결과</td>
                                    <td>${all_grade}</td>
                                    <td>${(all_score/all_grade).toFixed(2)}</td>
                                  </tr>`;

    table = table + `</table>`
    return table;
  },
  HTML: function(table) {
    return `<html>
              <head>
                <title>학점 다이어리</title>
                <meta charset="utf-8">
                <link rel="stylesheet" href="/stylesheets/main.css" type="text/css">
              </head>

              <body>
                <div id = 'header'>
                  <h1><a href="/">학점 다이어리</a></h1>
                </div>

                <div id = 'table'>
                  ${table}
                  <br>
                  <a href="/input">과목 입력</a>
                  <a href="/delete">과목 삭제</a>
                  <a href="/update">과목 수정</a>
                  <br>
                  <br>
                  <a href="/">목록으로</a>
                </div>

              </body>
              </html>`;
  }
}
