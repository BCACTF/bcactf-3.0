
FROM --platform=linux/amd64 python:3
RUN useradd -m -d /home/ctf -u 12345 ctf
WORKDIR /home/ctf

COPY GhostGame_deploy.py .
COPY ynetd .
RUN chmod +x ynetd

USER ctf
EXPOSE 9999
CMD ./ynetd -p 9999 "python3 -m GhostGame_deploy.py"