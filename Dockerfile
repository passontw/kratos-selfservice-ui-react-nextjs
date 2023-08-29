FROM node:18 as build

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
#RUN npm i -g nest @nestjs/cli && npm run build
RUN export $(cat .env | grep -vE "^#" | /usr/bin/xargs) ; npm i -g next ; npm run build

# Start the server using the production build
# CMD [ "npm", "run" ,"start:prod"]

# FROM nginx AS final
#COPY --from doesn't support variables, need assign source path
#COPY --from=build /usr/src/app/dist/dksh /usr/share/nginx/html
# COPY --from=build /app/dist /usr/share/nginx/html
# RUN apt update && apt install nginx watch nodejs npm -y && npm install -g express-session
RUN apt update && apt install nginx watch -y

# 覆蓋image裡的設定檔
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl/* /etc/nginx/ssl/

RUN apt update && apt install less vim net-tools iputils-ping -y 

# RUN apt update && apt install nginx watch nodejs npm -y && npm install -g express-session
# CMD ["npm", "run" ,"start:prod", "&", "nginx"]
# CMD ["node", "/usr/share/nginx/html/main.js", "&", "nginx"]
# CMD ["nginx", "-g", "daemon off;"]
# CMD ["/usr/local/bin/nest", "start", "&", "/usr/sbin/nginx ", "-g", "'daemon off;'"]
CMD ["sh", "-c", "export $(cat .env | grep -vE \"^#\" | /usr/bin/xargs) && nginx && npm run dev"]
# CMD ["{ nest start & }" ,";" ,"nginx;"]
# CMD ["/bin/sh", "/app/docker-entrypoint.sh", ";", "/usr/bin/watch", "/bin/ss", "-nltp"]
# CMD ["/bin/sh", "/app/start.sh"]
# CMD ["nest", "start"]
# CMD ["/usr/bin/watch", "/bin/ss", "-nltp"]
# ENTRYPOINT ["docker-entrypoint.sh"]

