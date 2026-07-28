--for Farmer
 CREATE TABLE farmers (
    farmerid serial primary key,
    name varchar(200) not null,
    email varchar(200) unique not null,
    phone varchar(15) not null,
    password varchar(100) not null,
    farm_intro text,
    worker_requirement text,
    farm_location varchar(200),
    alter table farmers add upi_id varchar(50),
    created_at timestamp default current_timestamp,
 );

 --for worker
 CREATE TABLE workers (
    workerid serial primary key,
    name varchar(200) not null,
    email varchar(200) unique not null,
    phone varchar(15) not null,
    password varchar(100) not null,
    skills_ofworker text,
    capacity_ofworker text,
    wage_per_day_ofworker numeric(10,2) not null,
    wage_per_month_ofworker numeric(10,2) not null,
    alter table workers add upi_id varchar(50),
    created_at timestamp default current_timestamp,
 );

 --for APPLYING JOBS
 create table jobs (
    jobid serial primary key,
    farmer_id integer references farmers(farmerid) on delete cascade,
    title varchar(100),
    description text,
    location varchar(200),
    wage numeric(10,2),
     required_skills TEXT,
    posted_at timestamp default current_timestamp 
 );

 --for application
 create table applications (
    id serial primary key,
    worker_id integer references workers(workerid)  on delete cascade,
    job_id integer references jobs(jobid) on delete cascade,
    message text,
    status varchar(20) default 'pending',
    applied_at timestamp default current_timestamp
);

-- create table contacts (
--    id serial PRIMARY KEY,
--    name varchar(100) not null,
--    email varchar(100) not null,
--    subject varchar(200) not null,
--    message text not null,
--    created_at timestamp default current_timestamp
-- );

-- CREATE TABLE screenshots (
--     screenshot_id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL,
--     target_id INTEGER NOT NULL,
--     image_data TEXT NOT NULL, -- Stores base64-encoded screenshot
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES farmers(farmerid) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES workers(workerid) ON DELETE CASCADE,
--     FOREIGN KEY (target_id) REFERENCES farmers(farmerid) ON DELETE CASCADE,
--     FOREIGN KEY (target_id) REFERENCES workers(workerid) ON DELETE CASCADE
-- );