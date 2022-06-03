FROM node:16 AS frontend-build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:16 AS backend-build
WORKDIR /usr/src/app
COPY api/package*.json .
RUN npm ci
COPY api .
RUN npm run build

FROM node:16
WORKDIR /usr/src/app
COPY --from=frontend-build /usr/src/app/build .
COPY --from=backend-build /usr/src/app api/
COPY flag.txt .
CMD [ "node",  ]