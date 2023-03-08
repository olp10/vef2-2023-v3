import { test, describe, expect } from '@jest/globals';
import { fetchAndParse, patchAndParse } from './utils.js';

describe('departments', () => {
  test('GET /departments', async () => {
    const { status } = await fetchAndParse('/departments');
    expect(status).toEqual(200);
  });

  test('PATCH /departments/', async () => {
    const data = {
      name: 'Test department',
      csv: 'Test csv',
      slug: 'test-department',
      description: 'This is a test department'
    }
    const { status } = await patchAndParse('/departments/hagfr-ideild', data);
    expect(status).toEqual(200);
  });
})
