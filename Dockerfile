FROM node:latest

ADD . /application
WORKDIR /application

RUN apt-get update && \
    apt-get -y install wkhtmltopdf && \
    npm install && \
    npm install -g nodemon

EXPOSE 3000
