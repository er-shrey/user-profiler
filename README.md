# User Profiler

This application is submitted as an assignment as an interview process at Logikview Analytics.


## Design Document

- Admin can add User profile data in a database table.
- At a certain interval ( 30 min ), a scheduler will fetch the records which are new i.e. user didn't updated*.
- After fetching, a profile edit link is created and sent to user via email.
- User then updates the profile based on the link.

> User will keep recieving profile update link on every interval untill and unless user updates the profile.


## Application details:

- Backend: NodeJs, version: 12+
- Frontend: Angular, version: 9+
- Database: Sqlite
- ORM: Sequelize

## App configurations

Application configuration file is `./config/config.json`

You'll find configuration for Database, SMTP, etc.

### Configuring Database settings

We have the following fields for database settings
- databaseName: Database name
- port: Port of DB server
- host: Server host of the DB
- username: Username of DB user
- password: Password of DB user
- dialect: Type of Database server (values can be: sqlite | mysql | mariadb | postgres | mssql )

> Currently the selected dialect/database is `sqlite`, if you want to change the database, make sure you install the appropriate middleware.

### Configuring SMTP settings

The following settings are available for SMTP
- host: Server host, eg: `smtp.gmail.com`
- port: Port where server accepts SMTP requests, eg: 465
- secure: `true` if port 465
- username: Email of the sender
- password: Password for authentication
- sender: Name of the sender

## Running the Application

After finishing the app configuration, you just need to start the server. Which can be done by following command:

`npm start`

The server will start by default to port `8001`

## Creating User

For creating a user, you'll require to make HTTP POST call to the following API

`http://localhost:<port>/api/users/`

The parameters that can be sent are as follows:
- email (mandatory)
- firstname (optional)
- lastname (optional)

You can use postman to do this

```
The application is protected under GPLv3.0
```