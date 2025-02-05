FROM node:23-alpine3.20
WORKDIR /crud-react-node-mySQL-go/backend
COPY package*.json ./
RUN npm install && npm install -g nodemon
COPY . .
EXPOSE 8800
CMD ["npm", "start"]