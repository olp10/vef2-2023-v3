import { readFile } from 'fs/promises';
import pg, { QueryResult } from 'pg';
import { join } from 'path';
import { Department, mapDbDepartmentsToDepartments } from './departments.js';
import { parse } from './parser.js';
import { Class } from './classes.js';
import dotenv from 'dotenv';
import { slugify } from '../utils/slugify.js';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const DATA_DIR = './data';

dotenv.config();

const { DATABASE_URL: connectionString } =
  process.env;

const pool = new pg.Pool({ connectionString });

pool.on('error', (err: Error) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

type QueryInput = string | number | null;

export async function query(q: string, values: Array<QueryInput> = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
      console.error('unable to query', e);
    return null;
  } finally {
    client.release();
  }
}

export async function addDepartment(department: Department) {
  const q = `INSERT INTO departments (name, title, slug, description) VALUES ($1, $2, $3, $4) RETURNING id`;
  const values : Array<string> = [
    department.name,
    department.title,
    department.slug,
    department.description,
  ];
  const result = await query(q, values);
  return result?.rows[0]?.id;
}

export async function addClass(classObj: Class, deptSlug : string) {
  const q = `INSERT INTO classes (department, name, number, semester, credits, degree, linkToSyllabus) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
  const values : Array<string> = [
    deptSlug,
    classObj.name,
    classObj.number,
    classObj.semester? classObj.semester: "",
    classObj.credits? JSON.stringify(classObj.credits) : "0",
    classObj.degree? classObj.degree: "",
    classObj.linkToSyllabus? classObj.linkToSyllabus : "",
  ];

  try {
    const result = await query(q, values);
    return result?.rows[0]?.id;
  } catch (e) {
    console.error('unable to add class', e);
    return null;
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('latin1'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('latin1'));
}

export async function end() {
  await pool.end();
}

export async function makeDb() {
  const jsonData = await readFile('./data/index.json', 'utf-8');
  const parsed = JSON.parse(jsonData);
  const results = [];

  for (const file of parsed) {
    const name = JSON.stringify(Object.values(file)[0]).replace(/["']/g, '');
    const title = JSON.stringify(Object.values(file)[2]).replace(/["']/g, '');
    const description = JSON.stringify(Object.values(file)[1]).replace(/["']/g, '');
    const csv = JSON.stringify(Object.values(file)[2]).replace(/["']/g, '');

    const department : Department = {
      title: title,
      slug: slugify(name),
      description: description,
      id: 0,
      name,
    }
    await addDepartment(department)

    if (file) {
      const classes = await parse(join(DATA_DIR, title), title.substring(0, title.length - 4));
        const result : Department = {
          title,
          classes,
          description,
          id: 0,
          slug: csv,
          name,
        };

        if (result.classes) {
          results.push(result);
        }
      }
    }
}

export async function dbDeleteDepartment(dept : string) {
  const q = `DELETE FROM departments WHERE slug = $1 RETURNING id`;
  const values = [dept];
  const result = await query(q, values);
  return result?.rows[0]?.id;
}

/*

export async function conditionalUpdate(table : string, id : string, fields : Array<string | null>, values : Array<string | null>) : Promise<pg.QueryResult> {

  if (!fields) {
    return null;
  }

  const filteredFields = fields.filter((i: any) => typeof i === 'string');

  const filteredValues = values.filter(
    (i: any) => typeof i === 'string' || typeof i === 'number' || i instanceof Date
  );

  if (filteredFields.length === 0) {
    return ;
  }

  if (filteredFields.length !== filteredValues.length) {
    throw new Error('fields and values must be of equal length');
  }

  // id is field = 1
  const updates = filteredFields.map((field, i) => `${field} = $${i + 2}`);

  const q = `
    UPDATE ${table}
      SET ${updates.join(', ')}
    WHERE
      id = $1
    RETURNING *
    `;

  const queryValues = filteredValues;
  const result = await query(q, queryValues);
  if (result) {
    return result.rows[0];
  }


}
*/
