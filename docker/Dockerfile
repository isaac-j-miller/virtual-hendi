FROM ubuntu:21.04
ENV TZ America/New_York
ENV VH_ROOT .
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
ADD ./build .
RUN apt-get install -y nodejs npm python3 python3-venv
RUN ./prepare-docker
CMD node ${VH_ROOT}/back/bin/www