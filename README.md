# ScheduleApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.4.

## Description

A simple web app tool for creating work shift schedules. 

There are two types of user profiles/permission:

1. Admins (super users):
- have access to the Admin Dashboard and full Users List
- able to create User profiles and set up permissions
- able to create shedule for the week
- able to export all work schedule records from DB
- receive emails when an employee requests a shedule start time change

2. Users (normal employee user profiles):
- have access to the User Dashboard
- able to view oly their own scheduled work shifts for the week
- able to request shedule changes and notify particular Admin
- receive email when the change is approved or rejected 

Tech stack using: 
- Frontend: Angular 10, HTML, Bootstrap CSS
- Backend: NodeJS, Express, MongoDB


## Installation

Run `npm install` to to install project and all dependencies.

## Development server

1. Frontend: Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.
2. Backend: `cd server` and run `nodemon server.js` to start Express server.
3. Create a folder for csv exports inside the `server` folder and name it `exports`

## MongoDB access

Navigate to `https://account.mongodb.com/account/login`. Test account is registered under:
Email: .env/AUTH_EMAIL
Pass: .env/AUTH_PASS

## App Default Admin account access

Initial login with test admin user credentials:
Email: .env/AUTH_EMAIL
Pass: .env/AUTH_PASS
