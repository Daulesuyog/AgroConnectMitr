--for farmers table
insert into farmers ( name, email, phone, password, farm_intro, worker_requirement, farm_location) values
  ('Suyog Daule', 'suyog67@gmail.com', '8999289355', 'password123', 'we grow sugarcane and rice', '2 farm workers needed for rice planting', 'Newasa'),
  ('Rutuja Daule', 'rutuja67@gmail.com', '8999289356', 'password123', 'we grow wheat and soybeans', '2 farm workers needed for wheat planting', 'Pune');


--for workers table
insert into workers (name, email, phone, password, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker) values 
 ('Kunal Dongare', 'kunal123@gmail.com', '8999289357', 'password132', 'plowing, sowing', 'can work 8 hours a day', 250, 7000),
 ('Manish Naik', 'manish123@gmail.com', '8999289358', 'password133', 'harvesting, weeding', 'Full time', 200, 6000);

--for jobs table
insert into jobs (farmer_id, title, description, location, wage) values
(1, 'Rice Planting', 'Need 2 farm workers for rice planting in Newasa', 'Newasa', 300),
(2, 'Wheat Harvesting', 'Need 2 farm workers for wheat harvesting in Pune', 'Pune', 350);

--for applications table
insert into applications (worker_id, job_id, message) values 
(1, 1, 'I have 2 years experience in transplanting work.'),
(2, 2, 'Available in the morning hours for harvesting work.');
