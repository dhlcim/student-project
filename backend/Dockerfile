# Node.js 공식 이미지 사용
# - 18-alpine: Node.js 18버전, alpine은 용량이 작은 리눅스
FROM node:18-alpine

# 컨테이너 안에서 작업할 폴더 설정
# - 이후 명령어는 모두 이 폴더 기준으로 실행
WORKDIR /app

# package.json 먼저 복사 후 의존성 설치
# - npm install: package.json에 적힌 라이브러리 설치
COPY package.json .
RUN npm install

# 나머지 소스코드 복사
COPY . .

# 3000번 포트 오픈
EXPOSE 3000

# 컨테이너 시작 시 실행할 명령어
CMD ["node", "index.js"]
