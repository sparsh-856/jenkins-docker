# Alpha SSH Monitor Server and Client App

The Alpha SSH Monitor app is packed together as both a server and client app.  The Alpha Server app is a web server + socket server that collects the ssh log-in metrics sent by the Alpha Client app. 

The Alpha Client app is a socket.io-client app that watches
for Failure log-in attemps in the Node where the Client is running and responds back to Server whenever there is a failed log-in attempt. 

The Alpha SSH Monitor application is built using Node.js, Express, socket.io.

Note: The application is created to collect log-in failure attempt metrics from Linux based nodes

## Establish environment variables

Copy the .env.example file with default environment variables for development to .env

```
cp .env.example .env
```

```
# set the protocol to connect to server app in ALPHASERVER_PROTOCOL
ALPHASERVER_PROTOCOL=http

# set server hostname that client app should connect to. 
# Note: If you are running server and client in local machine, set ALPHASERVER_HOSTNAME = localhost. If running the setup using
# docker-compose as shown in the later section of this Readme, set ALPHASERVER_HOSTNAME as the container name as shown below
ALPHASERVER_HOSTNAME=alphasolution_alphaserver_1

# set server Port number that client should connect to in ALPHASERVER_PORT
ALPHASERVER_PORT=3000

# set the LOG file absolute path in AUTH_LOG_FILE. User authentication logs are located at /var/log/secure for RHEL based systems
# and /var/log/auth.log for Debian based systems.
AUTH_LOG_FILE=/var/log/auth.log
```

## Install dependencies and prerequisites

### Prerequisites:

The application uses Node.js > 10.18.0 at the time of creation. Please make sure your machine has the correct node version.
If Not, you can follow the instructions below to install NVM (node version manager) which allows to run multiple versions of Node
in a machine and AVN which switch Node version based on .nvm file ( lts/dubnium was pointing at 10.18.0 at the time of creation of this application)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
nvm install lts/dubnium
npm install -g avn avn-nvm avn-n
avn setup
```
For Local containerized development, we use docker and docker-compose tool
Please make sure both are installed in your machine

### Install the dependency packages:

```
npm install
```

## Run

Start the server...

```
npm start server
```

In another terminal window start the client app...

```
npm run client
```

You can run any number of clients by running the above command in new terminals.

## Development

Most development is in JavaScript, and can be done in any editor or IDE.

## Test

```
npm test
```

## Auto setup and Deployment in Local Machine (Development)

For deploying the whole setup in local machine and automatically create server and clients, we use Docker Compose tool.

#### Run the following single command to build docker images, run the server and 2 node client apps automatically

```
docker-compose up -d --scale alphaclient=2 --build
```
You can any run number of clients. Just change ```--scale alphaclient=< required num of client apps >```

To check if the apps are running, run
```
docker-compose ps
```
Also note the port numbers of the clients when running the above command to try ssh to the clients from your local machine.

To see the metrics sent from the Clients to Server, run
```
docker-compose logs -f alphaserver
``` 

Now you can attempt ssh connections between clients by running the following commands
```
docker exec -it alphasolution_alphaclient_1  ssh root@alphasolution_alphaclient_2

docker exec -it alphasolution_alphaclient_2  ssh root@alphasolution_alphaclient_1
```
or from your local machine to one of the client

```
ssh root@localhost -p <ssh port-number of the client app from docker-compose ps>
```

Note: ssh to server is denied as sshd is not installed when running as server. 