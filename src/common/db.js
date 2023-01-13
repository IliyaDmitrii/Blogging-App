import sql from 'pg-sql2';
import pg from "pg";

let pool;
function _createDbPool() {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL
    });
    return pool;
}

export async function getAll(table) {
    if (table == null) {
        throw new Error('A table name must be supplied.');
    }

    const query = sql.query`SELECT * FROM ${sql.identifier(table)}`;
    const compiledQuery = sql.compile(query);
    const result = await pool.query(compiledQuery);
    return result.rows;
}

export async function getByQuery(table, id, status) {
    if (table == null) {
        throw new Error('A table name must be supplied.');
    }

    const query = sql.query`SELECT * FROM ${sql.identifier(table)} 
                            WHERE (${sql.identifier('userid')} = ${sql.value(id)} 
                            OR ${sql.identifier('status')} = ${sql.value(status)})`;
    const compiledQuery = sql.compile(query);
    const result = await pool.query(compiledQuery);
    return result.rows;
}

export async function getById(table, id, idField = 'id') {
    if (table == null) {
        throw new Error('A table name must be supplied.');
    }

    const query = sql.query`SELECT * FROM ${sql.identifier(table)} WHERE ${sql.identifier(idField)} = ${sql.value(id)}`;
    const compiledQuery = sql.compile(query);
    const result = await pool.query(compiledQuery);
    return result.rows[0];
}

export async function getByEmail(table, email, emailField = 'email') {
    const query = sql.query`SELECT * FROM ${sql.identifier(table)} WHERE ${sql.identifier(emailField)} = ${sql.value(email)}`;
    const compiledQuery = sql.compile(query);
    const result = await pool.query(compiledQuery);
    return result.rows[0];
}

export async function insert(table, payload) {
    const fields = Object.keys(payload);
    const values = Object.values(payload);

    if (table == null) {
        throw new Error('A table name must be supplied.');
    }

    if (fields == null || fields.length === 0) {
        throw new Error('A fields array with at least one field must be supplied.');
    }

    if (values == null || values.length === 0) {
        throw new Error('A values array with at least one value must be supplied.');
    }

    if (fields.length !== values.length) {
        throw new Error('Fields and values arrays must have the same number of elements.');
    }

    const fieldTokens = sql.join(fields.map(item => sql.query`${sql.identifier(item)}`),',');
    const valueTokens = sql.join(values.map(item => sql.query`${sql.value(item)}`),',');

    const insertQuery = sql.query`INSERT INTO ${sql.identifier(table)} (${sql.join(fieldTokens)}) VALUES (${sql.join(valueTokens)}) RETURNING *`;
    const compiledQuery = sql.compile(insertQuery);
    const result = await pool.query(compiledQuery);
    return result.rows[0];
}

export async function update(table, id, payload, idField = 'id') {
    if (table == null) {
        throw new Error('A table name must be supplied.');
    }

    if (id == null) {
        throw new Error('A record id must be supplied.');
    }

    if (payload == null || typeof payload !== 'object') {
        throw new Error('An payload object must be supplied.');
    }

    const setStatements = sql.join(Object.entries(payload).map(
        item => sql.query`${sql.identifier(item[0].toLowerCase())} = ${sql.value(item[1])}`
    ), ', ');

    const updateQuery = sql.query`
        UPDATE ${sql.identifier(table)}
        SET ${sql.join(setStatements)}
        WHERE ${sql.identifier(idField)} = ${sql.value(id)}`;

    const compiledQuery = sql.compile(updateQuery);
    const result = await pool.query(compiledQuery);
    return result.rows[0];
}

export async function remove(table, id, idField = 'id') {
    console.log(id)
    const deleteQuery = sql.query`DELETE FROM ${sql.identifier(table)} WHERE (${sql.identifier(idField)} = ${sql.value(id)})`;
    const compiledQuery = sql.compile(deleteQuery);

    await pool.query(compiledQuery);
    return true;
}

_createDbPool();

