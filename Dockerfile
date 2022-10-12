FROM node:lts-alpine3.15
RUN apk --no-cache upgrade
ENV NODE_ENV production
WORKDIR /home/node/app
COPY . .
RUN npm install
RUN chown -R node *
USER node
ENTRYPOINT [ "node", "index.js" ]