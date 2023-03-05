import { QueryResult } from "pg";
import { slugify } from "../utils/slugify.js";
import { Class } from "./classes.js";
import { query } from "./db.js";

export type Department = {
  id: number;
  title: string;
  name: string;
  slug: string;
  description: string;
  classes?: Array<Class>;
}

export function departmentMapper(input: unknown): Department | null {
  const potentialDepartment = input as Partial<Department> | null;

  if (
    !potentialDepartment ||
    !potentialDepartment.id ||
    !potentialDepartment.title ||
    !potentialDepartment.slug ||
    !potentialDepartment.description ||
    !potentialDepartment.name
    ) {
       return null;
  }

  const department: Department = {
    id: potentialDepartment.id,
    name: potentialDepartment.name,
    title: potentialDepartment.title,
    slug: slugify(potentialDepartment.name),
    description: potentialDepartment.description,
    classes: [],
  }
  return department;
}

export function mapDbDepartmentToDepartment(input: QueryResult<any> | null): Department | null {
  if (!input) {
    return null;
  }

  return departmentMapper(input.rows[0]);
}

export function mapDbDepartmentsToDepartments(input: QueryResult<any> | null): Array<Department> {
  if (!input) {
    return [];
  }
  const mappedDepartments = input?.rows.map(departmentMapper);
  return mappedDepartments.filter((i): i is Department => Boolean(i));
}

export async function findDepartmentNameBySlug(slug: string): Promise<string | null> {

  const result = await query('SELECT * FROM departments WHERE slug = $1', [slug]);
  const department = mapDbDepartmentToDepartment(result);
  if (department) {
    return department.title;
  }
  return null;
}

export async function findAllDepartments(): Promise<Array<Department>> {
  const result = await query('SELECT * FROM departments');
  if (result) {
    console.log(result.rows);
    return result.rows;
  }
  return [];
}
