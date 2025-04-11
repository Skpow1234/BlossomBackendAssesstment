FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Create Sequelize directories
RUN mkdir -p src/migrations src/models src/seeders

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 