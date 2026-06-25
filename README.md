# Product Explorer - Cursor Pagination

## Overview

A scalable product catalog application built with Node.js, PostgreSQL, Express, React, and Neon.

The project demonstrates efficient cursor-based pagination for large datasets (200,000+ products) while supporting category filtering and consistent pagination under concurrent inserts.

## Live Demo

Frontend:
https://product-explorer-cursor-pagination.vercel.app

Backend:
https://product-explorer-cursor-pagination.onrender.com

GitHub:
https://github.com/yoganand-cmd/product-explorer-cursor-pagination

## Features

* Cursor-based pagination
* Category filtering
* Configurable page size
* React frontend
* PostgreSQL database
* Optimized indexes
* Consistent pagination during concurrent inserts

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* Neon Database

### Frontend

* React
* Vite
* Axios

## Database Design

Products Table:

* id
* name
* category
* price
* created_at
* updated_at

Indexes:

* (created_at DESC, id DESC)
* (category, created_at DESC, id DESC)

## API Endpoints

Get Products

GET /products

Example:

/products?limit=20

Category Filter:

/products?category=Electronics

Cursor Pagination:

/products?created_at=<timestamp>&id=<id>

Combined:

/products?category=Electronics&created_at=<timestamp>&id=<id>

## Performance

Used EXPLAIN ANALYZE to verify index usage.

Query execution time remained below 1ms for filtered queries.

## Why Cursor Pagination?

Cursor pagination avoids:

* Slow OFFSET scans
* Duplicate records
* Missing records during concurrent inserts

This makes it suitable for large-scale product catalogs.

## Setup

Backend:

npm install
node server.js

Frontend:

cd frontend
npm install
npm run dev

## Author

⭐Pavuluri Yoganand
