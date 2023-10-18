from debian

env NODE_VERSION=18.9.0
run apt update && \
  apt install --yes curl xz-utils && \
  apt clean && \
  curl -sSL "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" | tar xfJ - -C /usr/local --strip-components=1
