# Sports Scheduler

## Overview
The Sports Scheduler is a web application that allows administrators to manage available sports and enables players to create and join sport sessions. The project follows an agile development approach, where features are defined as user stories for different personas.

## Features

### Admin Features
1. **Create Sports:**
   - Admins can create sports by providing a name.
   - Admins can view a list of sports they have created.
   
2. **Create Sport Sessions:**
   - Admins can create sport sessions like regular players.
   - Admins can join sessions they create.
   
3. **View Reports:**
   - Admins can access reports showing the number of sessions played in a configurable time period.
   - Admins can analyze the popularity of different sports based on participation.

### Player Features
1. **Sign Up and Sign In:**
   - New users can sign up by providing their name, email, and password.
   - Existing users can sign in with their email and password.
   - Users can sign out at any time.

2. **Create Sport Sessions:**
   - Players can create a new sport session.
   - They can select an available sport, specify team members, and indicate the number of additional players needed.
   - They must provide the date, time, and venue for the session.
   - Sessions created by a player are displayed separately.

3. **View and Join Sessions:**
   - Players can view existing sport sessions created by other users.
   - Players can join a session, and their name is marked in the participant list.
   - Players cannot join past sessions.
   - Sessions joined by a player are displayed separately from available sessions.

4. **Cancel Created Sessions:**
   - Players who created a session can cancel it by providing a reason.
   - The cancellation reason is visible to all users who had joined the session.
   - Canceled sessions are marked distinctly in the player’s session list.

### Optional Features
- Users can change their password.
- Players receive warnings if they attempt to join multiple sessions at the same date and time.

## Technologies Used
- **Backend:** Node.js, Express.js, PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (Client-side rendering)
- **Database:** PostgreSQL for storing users, sports, and sessions
- **Authentication:** Sessions or JWT-based authentication

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repository/sports-scheduler.git
   cd sports-scheduler
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the database:
   - Ensure PostgreSQL is installed.
   - Create a database:
     ```sh
     createdb sports_scheduler
     ```
   - Run migrations to create tables.
   
4. Configure environment variables:
   - Create a `.env` file and add database credentials.
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/sports_scheduler
   ```

5. Start the server:
   ```sh
   npm start
   ```
6. Access the application at `http://localhost:3000`.

## Database Schema
### Users Table
| Column    | Type        | Description                  |
|-----------|------------|------------------------------|
| id        | SERIAL     | Primary Key                  |
| name      | VARCHAR    | Player/Admin Name            |
| email     | VARCHAR    | Unique Email ID              |
| password  | VARCHAR    | Hashed Password              |
| role      | ENUM       | `player` or `admin`          |

### Sports Table
| Column   | Type        | Description                 |
|----------|------------|-----------------------------|
| id       | SERIAL     | Primary Key                 |
| name     | VARCHAR    | Name of the Sport           |
| admin_id | INTEGER    | Creator (Admin)             |

### Sessions Table
| Column         | Type        | Description                             |
|---------------|------------|-----------------------------------------|
| id            | SERIAL     | Primary Key                             |
| sport_id      | INTEGER    | Reference to the Sport                  |
| creator_id    | INTEGER    | Reference to the User (Creator)         |
| time          | TIMESTAMP  | Scheduled Date and Time                 |
| place        | VARCHAR    | Venue of the session                    |
| players_list  | TEXT       | Comma-separated Player IDs              |
| max_players   | INTEGER    | Additional Players Needed               |
| status        | ENUM       | `active`, `cancelled`                   |
| cancel_reason | TEXT       | Reason for cancellation (if any)        |

## API Endpoints
### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Log in an existing user
- `POST /logout` - Log out the current user

### Sports Management
- `GET /sports` - List all sports
- `POST /sports` - Create a new sport (Admin only)

### Session Management
- `GET /sessions` - List all sessions
- `POST /sessions` - Create a new session
- `POST /sessions/:id/join` - Join a session
- `DELETE /sessions/:id/cancel` - Cancel a session (Creator only)

## Future Enhancements
- Implement notifications for session updates.
- Add in-app chat for players to discuss sessions.
- Enhance reports with visual analytics.

## License
This project is open-source and available under the MIT License.

