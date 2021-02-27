# caps

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# To use the MongoDB Docker container, run the following commands from the root of the project:
$ docker-compose build
$ docker-compose up -d # the flag -d runs the container in detached mode (allows you to keep using the same terminal for other things)
# At this point, you should be able to use the debugger to run the project

# connect to mongo terminal inside docker container (the container name should be 'caps-store')
$ mongo -u caps-secret-admin -p caps-secret-admin-pwd --authenticationDatabase <name-of-docker-contaier-found-by-using-the-docker-ps-command> 
```


For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
