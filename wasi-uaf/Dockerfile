FROM ubuntu@sha256:86ac87f73641c920fb42cc9612d4fb57b5626b56ea2a19b894d0673fd5b4f2e9

RUN apt-get update -y && \
    apt-get install -y curl xz-utils && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -d /home/ctf -u 12345 ctf
WORKDIR /home/ctf

COPY ynetd .
COPY chall.wasm .
RUN chmod +x ynetd
RUN curl https://wasmtime.dev/install.sh -sSf | bash
RUN cp /root/.wasmtime/bin/wasmtime /usr/local/bin/wasmtime
RUN chown -R root:root /home/ctf
RUN mkdir /home/ctf/.cache/
RUN chmod 777 /home/ctf/.cache

USER ctf

EXPOSE 9999

CMD ./ynetd -p 9999 "/usr/local/bin/wasmtime ./chall.wasm"