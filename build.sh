#!/usr/bin/env bash 

docker build . -t yuxiqian/frontend:latest
docker push yuxiqian/frontend:latest