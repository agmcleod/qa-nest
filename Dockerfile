FROM node:16

WORKDIR /src/app

COPY . .

RUN yarn
ENV PATH /api/node_modules/.bin:$PATH
RUN yarn build
RUN rm -rf node_modules

EXPOSE 8080

CMD [ "sh", "-c", "node ./env.js && yarn start:prod" ]