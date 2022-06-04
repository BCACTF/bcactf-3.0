FROM docker.io/clojure:openjdk-11-lein-2.9.8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY project.clj /usr/src/app/
RUN lein deps
COPY . /usr/src/app
USER root
CMD [ "lein", "run" ]