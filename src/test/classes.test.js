import { test, describe, expect } from '@jest/globals';
import { fetchAndParse, postAndParse } from './utils.js';

describe('classes', () => {
  test('GET /classes', async () => {
    const { result } = await fetchAndParse('/classes');
    expect(result).not.toBeNull();
  });

  test('POST /departments/l-knadeild/classes', async () => {
    const classObj = {
      semester: 'Vor',
      credits: 12,
      name: 'Test class',
      number: '123',
      department: 'l-knadeild',
      degree: 'Grunnnám',
      linkToSyllabus: 'https://www.example.com/syllabus',
      slug: 'test-class',
    }
    const { status } = await postAndParse('/departments/l-knadeild/classes', classObj);
    // FIXME: Virkar ekki alveg, þarf að eyða gögnum úr fyrri keyrslu úr gagnagrunni
    // og uppfæra id manually fyrir hvert test
    /*
    expect (result).toEqual({
      'credits': 12,
      'degree': 'Grunnnám',
      'department': 'l-knadeild',
      'id': 1231,
      'linktosyllabus': 'https://www.example.com/syllabus',
      'name': 'Test class',
      'number': '123',
      'semester': 'Vor',
      'slug': 'test-class',
    }); */

    // FIXME: Virkar, en þarf að útfæra leið til að eyða fyrri fyrri keyrslu úr gagnagrunni
    // til að fá ekki duplicate-key

    // methodToRemovePreviousTestData();
    expect (status).toEqual(200);
  });
});
