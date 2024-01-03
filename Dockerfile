FROM us.gcr.io/logdna-k8s/node:20 AS base

WORKDIR /opt/app
ARG GITHUB_TOKEN

COPY ./package-lock.json ./package.json /opt/app/
  
RUN touch .npmrc \
  && echo '//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > .npmrc \
  && echo "@answerbook:registry=https://npm.pkg.github.com/" >> .npmrc \
  && npm ci \
  && rm .npmrc

COPY . /opt/app

FROM us.gcr.io/logdna-k8s/node:20-ci as test

COPY --from=base --chown=1000:logdna /opt/app /opt/app
USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends jq=1.6-2.1 python3-pip=20.3.4-4+deb11u1 unzip=6.0-26+deb11u1 zip=3.0-12 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN curl --insecure "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
USER 1000
RUN mkdir -p /opt/app/coverage
RUN chown -R 1000:logdna /opt/app/coverage

VOLUME /opt/app/coverage
WORKDIR /opt/app
USER 1000