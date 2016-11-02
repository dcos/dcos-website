FROM nginx:stable

# delete default nginx html
RUN rm -rf /usr/share/nginx/html/*

# copy in pre-built site content
COPY  ./build/ /usr/share/nginx/html/

# configure nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# set default version
RUN ln -sf /usr/share/nginx/html/docs/1.8 /usr/share/nginx/html/docs/latest

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
