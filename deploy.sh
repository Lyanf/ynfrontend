#!/usr/bin/env bash

sudo docker run -d -p 18080:8080 -p 18081:8081 --name ynfrontend yuxiqian/frontend:latest