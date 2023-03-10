# Blogging App

Utilizes Node.js 19.3.0 and framework Hapi.js

To install the modules:

```
npm install
```

For Dev:

* PostgresSQL v 15
    * Must have a database created to be used (e.g. `your_dbname`)
    * Must have a databaseURL configured as an environment variable DATABASE_URL in the following format: `postgresql://[user[:password]@][host][:port][/dbname]`
    * Must have a change db-migrator package `your_project\node_modules\db-migrator\bin\env.js` connection string like this  `config.connectionString = process.env.DATABASE_URL`
* Jwt - Json Web token package
* Bcrypt package
* Validation with Joi package
* And created database scripts use pg-sql2 package

##### By default, listens on port `7000`.

## Database migration scripts

| Script                      | Description  |  
|-----------------------------|---|
| `npm run db-migrate`        | Executes **all** migration scripts that have not been executed  | 
| `npm run db-rollback`       | Rolls back the **last** migration only. |
| `npm run db-create <name> ` | Creates new migration and rollback.  Created files are found in the `/migrations` folder. |
| `npm run db-status`         | Shows the current status of all migrations |

#### For More Info [db-migrator](https://www.npmjs.com/package/db-migrator) .

To start the service:

```
npm start
```