FROM node:23-alpine3.20
WORKDIR /crud-react-node-mySQL-go/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]