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
Go as far as you can / want, the purpose of this test is to check your coding style, 
your approach for implementing a functional task, how you test, document, etc. 

Don't hesitate to comment your code.

### Step 1 : user loyalty points

- user earn loyalty points for each spent euros (1 euro = 1 point)
- user can check its loyalty points total

### Step 2 : loyalty status

- user gets a loyalty status (novice, silver, gold, platinum), based on its total number of rides
- add to the route for spending money the fact of doing a ride or not
- user can check its current status
- optional: user can check its ride count and know how many rides remain to do to next status

### Step 3 : earning points based on current status

- number of points earned by euro depends on current user status
  - novice: 1 euro = 1 point
  - silver: 1 euro = 1 point
  - gold: 1 euro = 2 points
  - platinum: 1 euro = 3 points
