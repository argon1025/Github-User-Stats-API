# 베이스 이미지를 지정합니다
FROM node:16
# MAINTAINER argon1025@gmail.com

# 각명령어의 디렉토리 위치는 매번 초기화 되기 때문에
# 기본 디렉토리를 생성하고 해당 디렉토리로 위치를 고정 합니다
WORKDIR /usr/src/app

# 프로젝트를 복사합니다
COPY ./ ./

# 모듈을 설치합니다
RUN npm install

# 프로젝트를 빌드합니다
RUN npm run build

# 포트를 오픈합니다
EXPOSE 80

# 프로젝트를 시작합니다
CMD [ "node", "dist/main.js"]