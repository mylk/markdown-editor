FROM node:latest

ADD . /application
WORKDIR /application

RUN apt-get update
RUN apt-get -y install wkhtmltopdf
RUN npm install

EXPOSE 3000