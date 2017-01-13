# Technical Test

## Purpose

Develop a loyalty program micro-service. Using the provided basic skeleton, or by rewriting the whole
thing completely, implement the required services (see below).

The skeleton project uses [Swagger](http://swagger.io) and [Gulp](http://gulpjs.com/).

## Launch the server
``` bash
> npm install
> npm start
```

Open [http://localhost:3000/hello/robert/32](http://localhost:3000/hello/robert/32) to check the 
provided example route.

## To do

You must implement a loyalty micro-service, using express and a mongo database. 
Make your job in mind to create a pull request. 

### Step 1 : user loyalty points

- user earn loyalty points for each spent euros (1 euro = 1 point)
- user can check its loyalty points total

### Step 2 : loyalty status

- user gets a loyalty status (bronze, silver, gold, platinum), based on its total number of rides
- add to the route for spending money the fact of doing a ride or not
- user can check its current status
- optional: user can check its ride count and know how many rides remain to do to next status

### Step 3 : earning points based on current status

- number of points earned by euro depends on current user status
  - bronze: 1 euro = 1 point
  - silver: 1 euro = 3 point
  - gold: 1 euro = 5 points
  - platinum: 1 euro = 10 points
