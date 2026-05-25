// express: 웹 서버 프레임워크
// mysql2: MySQL 연결 라이브러리
// cors: 다른 포트(프론트)에서 API 요청 허용
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// JSON 형식 요청 파싱 허용
app.use(express.json());
// 모든 출처에서 API 요청 허용
app.use(cors());

// ─────────────────────────────
// DB 연결 설정
// - host: docker-compose에서 설정한 서비스 이름
// - 환경변수로 민감한 정보 주입
// ─────────────────────────────
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 실패:", err);
    return;
  }
  console.log("DB 연결 성공!");
});

// ─────────────────────────────
// 등급 계산 함수
// - 평균: 총점 / 과목 수
// - 등급: A(90↑) B(80↑) C(70↑) D(60↑) F(59↓)
// ─────────────────────────────
function getGrade(avg) {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

// ─────────────────────────────
// 학생 등록
// POST /students
// ─────────────────────────────
app.post("/students", (req, res) => {
  const { name, student_number } = req.body;
  const sql = "INSERT INTO students (name, student_number) VALUES (?, ?)";
  db.query(sql, [name, student_number], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, student_number });
  });
});

// ─────────────────────────────
// 전체 학생 조회 + 평균/등급
// GET /students
// - LEFT JOIN: 점수 없는 학생도 조회
// - AVG: 평균 계산
// ─────────────────────────────
app.get("/students", (req, res) => {
  const sql = `
    SELECT s.id, s.name, s.student_number,
           ROUND(AVG(sc.score), 1) AS average
    FROM students s
    LEFT JOIN scores sc ON s.id = sc.student_id
    GROUP BY s.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const students = results.map((s) => ({
      ...s,
      grade: s.average !== null ? getGrade(s.average) : "-",
    }));
    res.json(students);
  });
});

// ─────────────────────────────
// 특정 학생 조회
// GET /students/:id
// ─────────────────────────────
app.get("/students/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// ─────────────────────────────
// 학생 정보 수정
// PUT /students/:id
// ─────────────────────────────
app.put("/students/:id", (req, res) => {
  const { name, student_number } = req.body;
  const sql = "UPDATE students SET name=?, student_number=? WHERE id=?";
  db.query(sql, [name, student_number, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "수정 완료" });
  });
});

// ─────────────────────────────
// 학생 삭제
// DELETE /students/:id
// ─────────────────────────────
app.delete("/students/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "삭제 완료" });
  });
});

// ─────────────────────────────
// 점수 입력
// POST /scores
// ─────────────────────────────
app.post("/scores", (req, res) => {
  const { student_id, subject, score } = req.body;
  const sql = "INSERT INTO scores (student_id, subject, score) VALUES (?, ?, ?)";
  db.query(sql, [student_id, subject, score], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, student_id, subject, score });
  });
});

// ─────────────────────────────
// 점수 수정
// PUT /scores/:id
// ─────────────────────────────
app.put("/scores/:id", (req, res) => {
  const { subject, score } = req.body;
  const sql = "UPDATE scores SET subject=?, score=? WHERE id=?";
  db.query(sql, [subject, score, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "수정 완료" });
  });
});

// ─────────────────────────────
// 점수 삭제
// DELETE /scores/:id
// ─────────────────────────────
app.delete("/scores/:id", (req, res) => {
  const sql = "DELETE FROM scores WHERE id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "삭제 완료" });
  });
});

// 3000번 포트로 서버 실행
app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
