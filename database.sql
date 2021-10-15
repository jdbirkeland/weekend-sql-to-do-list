CREATE TABLE "todo" (
"id" SERIAL PRIMARY KEY,
"task" VARCHAR(250) NOT NULL,
"complete" BOOLEAN DEFAULT FALSE
);

INSERT INTO "todo" ("task","complete")
VALUES
('Create Full Stack App called To Do List', FALSE),
('Watch Vikings Game', FALSE),
('Mow the Yard', FALSE),
('Give the dogs a bath', FALSE);