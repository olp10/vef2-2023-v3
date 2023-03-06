CREATE TABLE public.classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    number VARCHAR(10) NOT NULL UNIQUE,
    credits FLOAT(3) NOT NULL,
    department VARCHAR(128) NOT NULL,
    degree VARCHAR(64),
    semester VARCHAR(32),
    linkToSyllabus VARCHAR(256),
    slug VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    csv VARCHAR(128) NOT NULL UNIQUE,
    slug VARCHAR(128) NOT NULL UNIQUE,
    description TEXT NOT NULL
);
