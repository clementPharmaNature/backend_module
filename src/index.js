const express = require('express');
const mariadb = require('mariadb');

const app = express();
const pool = mariadb.createPool({
  host: 'ec2-35-180-86-167.eu-west-3.compute.amazonaws.com',
  user: 'ec2-user',
  password: 'password',
  database: 'database-2'
});

app.get('/', (req, res) => {
  pool.getConnection()
    .then(conn => {
      conn.query('SELECT * FROM users')
        .then(rows => {
          conn.end();
          res.send(rows);
        })
        .catch(err => {
          conn.end();
          console.error('Error executing query: ' + err.stack);
          res.status(500).send('Error executing query');
        });
    })
    .catch(err => {
      console.error('Error getting connection from pool: ' + err.stack);
      res.status(500).send('Error getting connection from pool');
    });
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
