FROM node:18.14.0
WORKDIR /app
# we are copying the package.json file to the root directory of the container first before 
# because we want to install the dependencies first and then copy the rest of the files. 
# This way, we can take advantage of Docker’s cache system and avoid reinstalling the dependencies 
# every time we make a change to our code.
COPY package.json .
RUN npm install
COPY ./client/package.json ./client/package.json
RUN npm install --prefix ./client

# Copy the rest of the files
COPY . .
# by default all the ports are closed in the container, so we need to expose the port 3000 so we can access the app from the host browser.
EXPOSE 3000

CMD ["node", "api/index.js"]
