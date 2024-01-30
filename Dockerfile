FROM node:20.11.0-bullseye as test

COPY ./package-lock.json ./package.json /opt/app/  
COPY . /opt/app
RUN apt-get update \
  && apt-get install -y --no-install-recommends jq=1.6-2.1 unzip=6.0-26+deb11u1 zip=3.0-12 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

VOLUME /opt/app/coverage
WORKDIR /opt/app