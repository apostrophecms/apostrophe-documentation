FROM node:current
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD [ "./scripts/wait-for-it.sh", "mongo:27017", "--", "npm", "start" ]
