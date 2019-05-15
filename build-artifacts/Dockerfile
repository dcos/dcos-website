FROM node:8.16.0-jessie-slim

RUN apt-get update && apt-get install -y \
    git \
    python \
    build-essential \
    rsync \
    inotify-tools \
 && rm -rf /var/lib/apt/lists/*
