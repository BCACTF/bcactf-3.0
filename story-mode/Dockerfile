FROM clojure:openjdk-11-lein-2.9.8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY project.clj /usr/src/app/
RUN lein deps
COPY . /usr/src/app
USER root
ENV FLAG=bcactf{the_envd_jZNCCrTgxR237loZY12JlA}
CMD [ "lein", "run" ]