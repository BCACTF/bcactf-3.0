FROM --platform=linux/amd64 ubuntu@sha256:86ac87f73641c920fb42cc9612d4fb57b5626b56ea2a19b894d0673fd5b4f2e9

RUN useradd -m -d /home/ctf -u 12345 ctf
WORKDIR /home/ctf


# this is very hacky -- rust target did not want to work so had to build on diff machine and manually copy over binary
COPY ./target/ctf_problem .
COPY flag.txt .
COPY ynetd .

RUN chown -R root:root /home/ctf
RUN chmod +x ctf_problem 

USER ctf
EXPOSE 9999
CMD ./ynetd -p 9999 ./ctf_problem