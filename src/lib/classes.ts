import { QueryResult } from "pg";
import { query } from "./db.js";
import { mapDbDepartmentsToDepartments } from "./departments";

export type Class = {
  id: number;
  name: string;
  number: string;
  department: string;
  credits?: number;
  semester?: string;
  degree?: string;
  linkToSyllabus?: string;
}

export function classMapper(input: unknown): Class | null {
  const potentialClass = input as Partial<Class> | null;
  if (
    !potentialClass ||
    !potentialClass.id ||
    !potentialClass.name ||
    !potentialClass.number ||
    !potentialClass.semester ||
    !potentialClass.department ||
    !potentialClass.credits
  ) { return null;  }

  const classObj: Class = {
    id: potentialClass.id,
    name: potentialClass.name,
    number: potentialClass.number,
    semester: potentialClass.semester,
    credits: potentialClass.credits,
    department: potentialClass.department,
  }
  return classObj;
}

export function mapDbClassToClass(input: QueryResult<any> | null): Class | null {
  if (!input) {
    return null;
  }

  return classMapper(input.rows[0]);
}

export function mapDbClassToClasses(input: QueryResult<any> | null): Array<Class> {
  if (!input) {
    return [];
  }
  const mappedClasses = input?.rows.map(classMapper);
  return mappedClasses.filter((i): i is Class => Boolean(i));
}

export async function findClassesByDepartment(department: string): Promise<Array<Class>> {
  const result = await query('SELECT * FROM classes WHERE department = $1', [department]);
  return mapDbClassToClasses(result);
}
