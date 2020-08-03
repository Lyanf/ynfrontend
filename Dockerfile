FROM node
WORKDIR /app
COPY package.json /app/package.json
RUN npm install


EXPOSE 8080
COPY . /app
CMD npm run serve
