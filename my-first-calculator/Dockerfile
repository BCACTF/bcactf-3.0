FROM --platform=linux/amd64 node:16

RUN useradd -m -d /home/ctf -u 12345 ctf
WORKDIR /home/ctf

COPY ynetd .
COPY index.js .
RUN chmod +x ynetd

RUN chown -R root:root /home/ctf

USER ctf
EXPOSE 9999
CMD ./ynetd -p 9999 "node index"
