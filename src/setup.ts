import { createSchema, dropSchema, end, makeDb } from './lib/db.js';

export async function create() {
  const drop = await dropSchema();

  if (drop) {
    console.info('schema dropped');
  } else {
    console.info('schema not dropped, exiting');
    process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
  }
  await makeDb();
  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
