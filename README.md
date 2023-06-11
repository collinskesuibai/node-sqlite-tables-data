# node-sqlite-tables-data

`node-sqlite-tables-data` is an npm package that provides middleware for retrieving tables data from an SQLite database in an Express application. It allows you to fetch the data from all tables in the specified database and optionally return it in JSON or HTML format.

## Installation

Install the package using Yarn or npm:

```bash
yarn add node-sqlite-tables-data

npm install node-sqlite-tables-data
```

## Usage

To use `node-sqlite-tables-data` in your Express application, follow these steps:

1. Import the package and necessary dependencies:

```javascript
const express = require('express');
const sqliteTablesData = require('node-sqlite-tables-data');
```

2. Create an instance of your Express app:

```javascript
const app = express();
```

3. Mount the `sqliteTablesData` middleware with the database name:

```javascript
const dbName = 'your_database_name.db';
app.use('/tables-data', sqliteTablesData(dbName));
```

4. Start your Express server:

```javascript
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

5. Access the tables data:

You can now access the tables data by sending a GET request to `/tables-data`. The response can be in either JSON or HTML format, depending on the requested format.

- To get the data in JSON format, append `?format=json` to the request URL:
  `http://localhost:3000/tables-data?format=json`

- To get the data in HTML format, simply send a GET request to `http://localhost:3000/tables-data`.

## Examples

Here are a few examples to demonstrate how to use the `node-sqlite-tables-data` middleware:

- Retrieve tables data in HTML format:

```bash
GET /tables-data
```

- Retrieve tables data in JSON format:

```bash
GET /tables-data?format=json
```

## Contributing

Contributions are welcome! Feel free to submit any bug reports, feature requests, or pull requests.