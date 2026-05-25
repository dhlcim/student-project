# nginx 공식 이미지 사용
# - nginx: 정적 파일(HTML/JS/CSS)을 브라우저에 제공하는 웹서버
FROM nginx:alpine

# 로컬 frontend 폴더의 파일들을 nginx 기본 경로로 복사
# - /usr/share/nginx/html: nginx가 파일을 읽는 기본 폴더
COPY . /usr/share/nginx/html

# 80번 포트 오픈
EXPOSE 80
