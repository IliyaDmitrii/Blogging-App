-- 1673279333 UP init-db-setup

-- CREATE USERS TABLE
CREATE TABLE users (
   id uuid PRIMARY KEY,
   name varchar(64) NOT NULL,
   email varchar(64) NOT NULL,
   password varchar(64) NOT NULL,
   role varchar(64) NOT NULL,
   created_at timestamp NOT NULL,
   updated_at timestamp NOT NULL
);

-- CREATE POSTS TABLE
CREATE TABLE posts (
   id uuid PRIMARY KEY,
   userId uuid REFERENCES users(id) ON DELETE CASCADE,
   title varchar(64) NOT NULL,
   content varchar(64) NOT NULL,
   status varchar(64) NOT NULL,
   created_at timestamp NOT NULL,
   updated_at timestamp NOT NULL
);

