# MarketApp

MarketApp is a web application that provides user registration, login functionality, and a personalized dashboard experience. It's built with modern web technologies to ensure a smooth and responsive user interface.

## Features

- User Registration
- Secure Login
- Personalized Dashboard

## Technology Stack

- **Frontend**: React.js with Vite
  - Vite provides a fast and lean development experience for modern web projects.
  - React.js enables the creation of a dynamic and interactive user interface.

- **Backend**: Express.js
  - A minimal and flexible Node.js web application framework.

- **Database**: PostgreSQL
  - A powerful, open-source object-relational database system.

## Demo Login

![Logging in](https://github.com/ImmutableSpirit/MarketApp/blob/master/client-market-app/src/assets/marketApp-login.gif)

## Demo Dashboard

![Dashboard view](https://github.com/ImmutableSpirit/MarketApp/blob/master/client-market-app/src/assets/dashboard-01.png)

## Watchlist

![Watchlist](https://github.com/ImmutableSpirit/MarketApp/blob/master/client-market-app/src/assets/watchlist-test.png)

## Getting Started

Follow these steps to set up the project locally:
1. Clone the repository
  ``` git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name ```

2. Install PostgreSQL
- Download and install PostgreSQL from the official website.
- During installation, remember the password you set for the 'postgres' superuser.
3. Configure PostgreSQL
- Open pgAdmin or your preferred PostgreSQL management tool.
- Create a new database named 'MarketAppDb'.
4. Set up the environment variables
- In the server folder, create a .env file with the following content:

``` 
DB_USER=postgres
DB_HOST=localhost
DB_NAME=MarketAppDb
DB_PASS=<your PostgreSQL password>
DB_PORT=5432
JWT_SECRET=<your chosen secret key>
TWELVEDATA_API_KEY=<your TwelveData API key>
```
- Replace <your PostgreSQL password> with the password you set during PostgreSQL installation.
- Generate a secure random string for JWT_SECRET.
5. Get a TwelveData API key
- Sign up for a free plan at TwelveData.
- Obtain your API key from the dashboard.
- Add this key to your .env file as TWELVEDATA_API_KEY.
6. Install dependencies
- In the root directory, run:

``` npm install
cd client && npm install
cd ../server && npm install ```

7. Start the application
- In the client-market-app directory, run:

``` npm run dev ```
- In the server directory, run:
``` node app.js ```

This will start the frontend and backend servers.

8. Access the application
- Open your browser and navigate to http://localhost:5173 (or the port specified by Vite).

