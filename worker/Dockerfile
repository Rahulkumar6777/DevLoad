FROM ubuntu:focal

RUN /usr/bin/apt-get update && \
    /usr/bin/apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    /usr/bin/apt-get update && \
    /usr/bin/apt-get upgrade -y && \
    /usr/bin/apt-get install -y nodejs ffmpeg

WORKDIR /home/app


COPY 'package.json' .
COPY 'package-lock.json' .

RUN npm ci

COPY 'output' .
COPY 'upload' .
COPY 'index.js' .
COPY ./src ./src

CMD ["node", "index.js"]