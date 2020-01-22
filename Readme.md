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
# docker-compose as shown in the later section of this Readme, set ALPHASERVER_HOSTNAME = alphasolution_alphaserver_1 as the container
# name. If you are running the client and server in different machines, set ALPHASERVER_HOSTNAME = hostname or ip address of server.
# If you are running the server and client using skaffold, set ALPHASERVER_HOSTNAME = alphaserver (service name of deployed server)
ALPHASERVER_HOSTNAME=localhost

# set server Port number that client should connect to in ALPHASERVER_PORT
ALPHASERVER_PORT=3000

# set the LOG file absolute path in AUTH_LOG_FILE. User authentication logs are located at /var/log/secure for RHEL based systems
# and /var/log/auth.log for Debian based systems.
AUTH_LOG_FILE=/var/log/auth.log
```

For the Client app to start successfully, all the above env variables are mandatory. Also there should be a /var/log/secure or /var/log/auth.log file present before starting the client app.

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
**For Local containerized development, we use docker, docker-compose, skaffold and local kubernetes cluster. Please make sure to install all in your machine**

The Alpha client uses linux rsyslog utility to collect auth logs when an ssh log-in attempt is made. So please make sure you have rsyslog service running in your client machine.
In the event rsyslog is missing, it can be install with YUM on CentOS and RHEL.
```
yum -y install rsyslog
```
Or rsyslog can be installed on Ubuntu or Debian with apt-get.
```
apt-get -y install rsyslog
```
Restart the rsyslog service to begin sending the logs to the /var/log directory.
```
service rsyslog restart
```
The Alpha client app watches log file created by rsyslog to collect metrics so please AUTH_LOG_FILE set as /var/log/auth.log for Debian based systems or set as /var/log/secure for RHEL based systems

### Important note

**There should be a /var/log/secure or /var/log/auth.log file present before starting the client app. If rsyslog is installed newly, these log files will not be created nor found. These files will be created by rsyslog only when there is log-in attempt or authentication attempt in the machine, hence the client app will fail to start if the files are not found. To overcome this, we manually create those files in those location before starting the client app.**

```
touch /var/log/auth.log /var/log/secure
```
**The Alpha client also need to be run as root/sudo user as the app will need permissions to read the log files from /var/log.**

## Install the dependency packages:

```
npm install
```

## Run

Start the server...

```
npm start server
```

In another terminal window or in another machine or in another node, start the client app...

```
npm run client
```

You can run any number of clients by running the above command in new terminals.
If you are running the client in another machine or node, make sure to set the server hostname in ALPHASERVER_HOSTNAME and ALPHASERVER_PORT environment variable.

## Development

Most development is in JavaScript, and can be done in any editor or IDE.
Commit-lint, a npm package that lints the commit message nad helps in following commit standards is used in this application development.
Also commitizen is used to provide a cli for commit standards to choose from. However, git command line tool is used most of the time for commiting changes with following commit standards.

## Test

```
npm test
```

## Auto setup and Deployment in Local Machine (Development)

For deploying the whole setup in local machine and automatically create server and clients, we use Docker Compose tool.

#### Run the following single command to build docker images, run the server and 2 node client apps automatically

##### Docker-Compose
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

##### Skaffold - Cluster Deployment

**Skaffold** is a tool that has many features, basically it helps in faster development, build, test, and deployment

Run the following command in a terminal to deploy the Alpha server and Alpha client once in K8s cluster.
```
skaffold run
```
Run the following command in a terminal to deploy the Alpha server and Alpha client once in K8s cluster and watch logs of the deployment.
```
skaffold run -v=info --tail
```