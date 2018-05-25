FROM node:6
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
WORKDIR /usr/app

COPY . .
VOLUME ["/usr/app/"]
RUN npm i
RUN npm i nodemon -g
EXPOSE 5000
