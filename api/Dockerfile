FROM node:18.14.0-slim

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .
RUN yarn install
# RUN yarn prisma generate

EXPOSE 3000

CMD [ "yarn", "run", "start" ]
