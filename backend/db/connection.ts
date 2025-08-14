import knex from 'knex';
import knexConfig from '../../knexfile';

const enviroment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[enviroment]);
export default db;