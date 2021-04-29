#!/usr/bin/env bash 

docker build . -t yuxiqian/ynfrontend:latest
docker push yuxiqian/ynfrontend:latest