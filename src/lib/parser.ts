import { slugify } from '../utils/slugify.js';
import { Class } from './classes.js';
import { addClass, addDepartment } from './db.js';
import { readFile } from './file.js';

/**
 *
 * @param {string} input Slóð á csv skrá sem inniheldur áfanga og upplýsingar um þá
 * @returns array af námskeiðum ef það eru einhver námskeið fyrir námsleiðina, annars []
 */
export async function parse(input : string, deptSlug : string): Promise<Array<Class>> {
  const data = await readFile(input, { encoding: 'latin1' });
  if (!data) {
    return [];
  }

  const splitData : Array<string> = data.split('\n');
  const results : Array<Class> = [];

  const regexEiningar = /^[0-9]*[,]?[0-9]?$/;
  const regexMisseri = /^Vor|Heilsárs|Sumar|Haust$/;

  for (const line in splitData) {
    if (line) {
      const moreSplitted = splitData[line].split(';');
      const number : string = moreSplitted[0];
      const name : string = moreSplitted[1];
      const credits = Number.parseInt(moreSplitted[2], 10);
      const semester = moreSplitted[3];
      const degree = moreSplitted[4];
      const linkToSyllabus = moreSplitted[5];
      const slug = name ? slugify(name) : '';

      if (moreSplitted[0] === '' || moreSplitted[4] === '' || moreSplitted[1] === '') {
        continue;
      }

      // Athuga hvort að misseri sé Vor/Sumar/Haust
      if (!regexMisseri.test(moreSplitted[3])) {
        continue;
      }

      // Athuga hvort einingar séu á forminu x,x/x => Samþykkir ekki einingafjölda með .
      if (!regexEiningar.test(moreSplitted[2])) {
        continue;
      }

      const result : Class = {
        id: 0, // TODO: laga fixed id
        number,
        name,
        credits,
        semester,
        degree,
        linkToSyllabus,
        department: deptSlug,
        slug,
      };
      addClass(result, deptSlug);
      results.push(result);
    }
  }
  if (results.length > 0) {
    return results;
  }
  return [];
}
