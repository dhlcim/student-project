-- student_db 데이터베이스 사용
USE student_db;

-- 학생 테이블 생성
-- - PRIMARY KEY: 고유 식별자
-- - AUTO_INCREMENT: 자동으로 1씩 증가
-- - NOT NULL: 빈 값 허용 안 함
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  student_number VARCHAR(20) NOT NULL
);

-- 점수 테이블 생성
-- - FOREIGN KEY: students 테이블의 id 참조
-- - ON DELETE CASCADE: 학생 삭제 시 점수도 자동 삭제
CREATE TABLE IF NOT EXISTS scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
