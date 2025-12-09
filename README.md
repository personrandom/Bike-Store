# Bike-Store - WIP

Hello Professor! This is our Fullstack project for Databases class

If you wish to run and test the program yourself you first must do a couple steps.

This project is split into two directories frontend and backend.
You will need to intall some dependecies for both of these folders.

Do do this first go to the node.js website and install it to your system: https://nodejs.org/en 
Make sure you have mysql installed!

Now open the terminal and type the following commands...
Go into the backend folder: cd Bike-Store/backend
Load the schema into mysql: mysql -u root -p < sql/schema.sql
Load csv data into schema: mysql -u root -p < sql/load_data.sql
Load contraints: mysql -u root -p < sql/constaints_indexs.sql
While inside the backend directory install dependencies: npm i
Launch the back end directory: npm run dev
From backend, go back and into the frontend directory: cd ..; cd frontend
Install frontend dependencies: npm i
Launch the front end directory: npm run dev

Now you can open the link and enjoy our awesom application!!! :)


