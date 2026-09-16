# Judgr — Hackathon Management & Evaluation Platform

[Live Demo](https://yesjudgr.vercel.app/) · [Repository](https://github.com/Kareena2070/judgr)

Judgr is a full-stack platform for organizing and joining hackathons. It currently supports public hackathon discovery, secure accounts, admin-managed hackathon timelines, and student team formation with invitations. The project is intentionally at an early product milestone: project submissions, judge workflows, and scoring are not yet implemented.

## What problem does it solve?

Hackathons often require organizers to manage event dates, team rules, and participant collaboration across several tools. Judgr brings the implemented parts of that journey into one application:

- Organizers can create and update hackathons with date and team-size rules.
- Visitors can browse public hackathon listings and details.
- Students can create, join, invite members to, and leave teams during registration.

## Current status

### Implemented

- Public landing page and hackathon discovery pages
- Email/password registration, login, logout, refresh-token session restoration
- JWT access-token authentication and role-based API authorization
- Admin hackathon creation and lifecycle-aware editing
- Public hackathon search, status filters, pagination, details, and date/status display
- Student team creation, joining, email invitations, invitation acceptance, roster display, and member leave action

### Partial or intentionally limited

- **Judge role:** the judge user role exists in the data model and login/navigation logic, but there is no judge page or judging workflow.
- **Frontend route guards:** student dashboard and admin routes redirect unauthenticated users; the team APIs are also protected server-side. Public hackathon pages are intentionally open.
- **Team membership race condition:** the backend documents a race window between checking team capacity and creating a membership. The unique membership index prevents duplicate membership of a user within a hackathon, but concurrent joins can still exceed capacity.
- **Notifications:** only in-app team-invitation records exist; there is no email, push, or generic notification delivery system.

### Not implemented

There are no registration records, submission records, file uploads, judging criteria, judge assignments, evaluations, scoring, announcements, queues, Redis integration, object storage, analytics, or automated tests in the current repository.

## Roles and permissions

| Role | Verified responsibilities |
| --- | --- |
| Public visitor | View the landing page, hackathon listing, and hackathon details without authentication. |
| Student | Register and sign in; view invitations; create/join teams during registration; accept invitations; leave a team as a member; view team rosters. |
| Team leader | A student who creates a team. Can invite existing student accounts by email. Leaders cannot leave through the current workflow because leader reassignment is not implemented. |
| Admin | Create and update hackathons; access the admin dashboard and hackathon management pages. |
| Judge | Present in the User role enum, but has no implemented dashboard, assignment, review, or scoring capabilities. |

## Main user flows

### Public discovery

~~~text
Landing page
  ↓
Browse / search hackathons
  ↓
View hackathon details, dates, status, and team-size limits
  ↓
Register or log in to participate
~~~

### Student team flow

~~~text
Register or log in
  ↓
Open a hackathon during REGISTRATION
  ↓
Create a team or join an existing team
  ↓
Leader invites an existing student by email
  ↓
Recipient accepts from the student dashboard
  ↓
View roster or leave as a non-leader member
~~~

### Admin hackathon flow

~~~text
Admin login
  ↓
Admin dashboard
  ↓
Create hackathon with timeline and team-size limits
  ↓
Review public listing/detail data
  ↓
Edit only fields permitted by the current lifecycle state
~~~

## Architecture

~~~mermaid
flowchart TD
    U[Visitor / Student / Admin] --> F[Next.js frontend]
    F -->|Axios requests with Bearer access token when available| A[Express API /api/v1]
    A --> M[Middleware: validation, authentication, RBAC, error handling]
    M --> C[Controllers and services]
    C --> DB[(MongoDB via Mongoose)]
~~~

The frontend uses one Axios client configured by NEXT_PUBLIC_API_URL. Access tokens are kept in browser memory; refresh tokens are set as HTTP-only cookies by the backend. The Express application exposes versioned routes under /api/v1, and services contain the hackathon and team business rules.

## Technology stack

### Frontend

- Next.js 16 (App Router)
- React 19
- JavaScript
- Tailwind CSS 4 via PostCSS
- Axios
- ESLint

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- JSON Web Token (jsonwebtoken)
- bcrypt password hashing
- Zod request validation
- cookie-parser, CORS, Morgan, and Pino logging

### Development and deployment

- npm
- Git and GitHub
- The live frontend is published at [yesjudgr.vercel.app](https://yesjudgr.vercel.app/).

No deployment configuration or confirmed backend hosting configuration is committed to this repository.

## Project structure

~~~text
judgr/
├── Backend/
│   ├── src/
│   │   ├── config/          # Environment configuration and MongoDB connection
│   │   ├── controllers/     # Auth, hackathon, and team request handlers
│   │   ├── middlewares/     # Auth, RBAC, validation, async/error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # /api/v1 route definitions
│   │   ├── services/        # Auth, hackathon, and team business logic
│   │   ├── utils/           # Tokens, API response/error classes, logging
│   │   └── scripts/         # Admin seed script
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (admin)/         # Admin dashboard and hackathon management routes
│   │   ├── (auth)/          # Login and registration pages
│   │   ├── (student)/       # Public hackathons, student dashboard, team page
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # AuthContext
│   │   └── lib/             # Axios API client
│   ├── public/              # Default static SVG assets
│   └── package.json
└── README.md
~~~

> Route groups such as (student) and (admin) organize source files but do not appear in URLs.

## Data model

| Entity | Purpose |
| --- | --- |
| User | Stores name, unique email, bcrypt password hash, role (student, judge, or admin), and active status. |
| Hackathon | Stores title, description, theme, timeline dates, team-size limits, creator, and a persisted status field. API responses derive the effective lifecycle status from dates. |
| Team | Represents an active named team for one hackathon and records its creator. |
| TeamMember | Joins a user to a team and hackathon with a leader or member role. Has a unique userId + hackathonId index. |
| Notification | Currently stores only team-invitation notifications, including recipient, team, message, read flag, and invitation state. |

~~~mermaid
erDiagram
    USER ||--o{ HACKATHON : creates
    HACKATHON ||--o{ TEAM : contains
    USER ||--o{ TEAM : creates
    TEAM ||--o{ TEAM_MEMBER : has
    USER ||--o{ TEAM_MEMBER : joins
    HACKATHON ||--o{ TEAM_MEMBER : scopes
    USER ||--o{ NOTIFICATION : receives
    TEAM ||--o{ NOTIFICATION : references
~~~

## API overview

All application routes are prefixed with /api/v1. Successful controller responses use:

~~~json
{ "success": true, "data": {}, "message": "..." }
~~~

Known application errors use:

~~~json
{ "success": false, "error": { "code": "...", "message": "..." } }
~~~

### Health and development checks

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /health | Public | Basic uptime/status response. |
| GET | /health/error | Public | Temporary known-error handler check. |
| GET | /health/error/unexpected | Public | Temporary unexpected-error handler check. |
| GET | /health/error/async | Public | Temporary async error-handler check. |
| POST | /health/validation | Public | Temporary validation middleware check. |

### Authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /auth/register | Public | Creates a student account. |
| POST | /auth/login | Public | Verifies credentials, returns an access token, and sets a refresh-token cookie. |
| POST | /auth/refresh | Refresh cookie | Returns a new access token. |
| GET | /auth/me | Authenticated | Returns the active current user. |
| POST | /auth/logout | Authenticated | Clears the refresh-token cookie. |
| GET | /auth/admin-test | Admin | Test-only RBAC endpoint. |

### Hackathons

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /hackathons?page=&limit=&status=&search= | Public | Lists hackathons. Supports page/limit pagination, lifecycle status filtering, and title/theme search. |
| GET | /hackathons/:id | Public | Gets one hackathon with effective status. |
| POST | /hackathons | Admin | Creates a hackathon. |
| PATCH | /hackathons/:id | Admin | Updates allowed fields, subject to lifecycle rules. |

### Teams and invitations

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /hackathons/:hackathonId/teams | Student | Creates a team and leader membership. |
| GET | /hackathons/:hackathonId/my-team | Student | Gets the caller’s team for a hackathon. |
| GET | /hackathons/:hackathonId/teams | Student | Lists active teams with member counts. |
| POST | /teams/:teamId/join | Student | Joins an existing team if eligible and not full. |
| GET | /teams/:teamId | Student | Gets a team and populated member roster. |
| POST | /teams/:teamId/invitations | Student leader | Invites an existing student by email. |
| POST | /teams/:teamId/leave | Student member | Leaves a team; leaders are blocked. |
| GET | /invitations/my | Student | Lists the caller’s pending team invitations. |
| POST | /invitations/:invitationId/accept | Student | Accepts a pending invitation when eligible. |

See [Backend/src/routes](Backend/src/routes) for exact validation requirements and middleware order.

## Authentication and authorization

1. A user registers or logs in with email and password.
2. The backend hashes passwords with bcrypt and signs an access JWT plus a refresh JWT.
3. Login returns the access token in the response body and stores the refresh token in an HTTP-only, sameSite: strict cookie. In production, the cookie is marked secure.
4. The frontend keeps the access token in memory. Its Axios request interceptor sends it as a Bearer token.
5. On one eligible 401 response, the Axios response interceptor calls /auth/refresh, stores the replacement access token, and retries the original request.
6. On app startup, AuthContext refreshes the session and calls /auth/me to restore the user.
7. Protected backend routes use authentication middleware and then role middleware. Admin hackathon mutations require admin; team operations require student.

Frontend guards redirect anonymous visitors from the student dashboard and admin pages. The public landing page and public hackathon pages deliberately do not require a session. Team endpoints remain protected by server-side role checks.

## Important business rules

### Hackathon lifecycle

- Required periods must be chronologically valid: registration, submission, and judging dates cannot overlap in invalid order.
- Team-size minimum cannot exceed maximum.
- Effective status is derived from the current date: DRAFT, REGISTRATION, SUBMISSION, JUDGING, or COMPLETED.
- During registration/submission, admins can update title, description, and theme but not dates or team size.
- During judging or after completion, hackathon editing is blocked.

### Team membership

- Teams can be created, joined, invited to, and accepted only while a hackathon is in REGISTRATION.
- A user may belong to only one team per hackathon, enforced by a compound unique index.
- A team creator becomes its leader; joiners and accepted invitees become members.
- Only a leader can invite another existing student account.
- Pending duplicate invitations are rejected.
- Team capacity is checked before joining or accepting an invite.
- Team leaders cannot leave in the current implementation; there is no leadership-reassignment flow yet.
- The service explicitly documents a concurrent join race window around capacity checks.

## Frontend routes

| Route | Audience | Current behavior |
| --- | --- | --- |
| / | Public | Landing page with featured hackathons. |
| /hackathons | Public | Searchable/filterable, paginated hackathon listing. |
| /hackathons/:id | Public | Hackathon detail, dates, status, and role-aware participation CTA. |
| /login, /register | Public | Authentication forms. |
| /student | Student | Student profile summary and pending invitation acceptance. |
| /hackathons/:id/team | Student APIs | Create/join view or current team roster/actions. |
| /admin | Admin | Basic admin dashboard. |
| /admin/hackathons | Admin | Hackathon management list. |
| /admin/hackathons/new | Admin | Hackathon creation form. |
| /admin/hackathons/:id/edit | Admin | Lifecycle-aware edit form. |

## Local setup

### Prerequisites

- Node.js and npm
- A MongoDB instance reachable from the backend

Redis, BullMQ, object storage, and a mail provider are not required by the current codebase.

### 1. Clone the repository

~~~bash
git clone https://github.com/Kareena2070/judgr.git
cd judgr
~~~

### 2. Configure the backend

~~~bash
cd Backend
npm install
~~~

Create Backend/.env using placeholders:

~~~env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb_connection_string
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret
JWT_ACCESS_EXPIRES_IN=access_token_lifetime
JWT_REFRESH_EXPIRES_IN=refresh_token_lifetime
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info

# Required only to run src/scripts/seedAdmin.js
ADMIN_NAME=admin_name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_secure_password
~~~

Start the API:

~~~bash
npm run dev
~~~

The backend defaults to port 5000 when PORT is not set. To create the optional initial admin account, run:

~~~bash
node src/scripts/seedAdmin.js
~~~

### 3. Configure the frontend

In a separate terminal:

~~~bash
cd frontend
npm install
~~~

Create frontend/.env.local:

~~~env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
~~~

Start the frontend:

~~~bash
npm run dev
~~~

Open [http://localhost:3000](http://localhost:3000).

### Useful frontend commands

~~~bash
npm run lint
npm run build
npm start
~~~

## Validation, errors, and security practices

- **Request validation:** Zod validates registration/login payloads, hackathon mutations/list query parameters, team creation, and invitations.
- **Model validation:** Mongoose validation enforces hackathon date ordering and team-size bounds.
- **Passwords:** bcrypt hashes passwords before storing them.
- **Authentication:** JWT access tokens are verified from Bearer headers; refresh tokens are delivered via HTTP-only cookies.
- **Authorization:** backend role middleware protects admin mutations and student team operations.
- **CORS:** the Express app uses the configured FRONTEND_URL origin with credentials enabled.
- **Errors:** a centralized error handler returns structured error codes and hides unhandled server error details.
- **Frontend feedback:** public pages include loading, empty, retry, and not-found states; team forms map several API error codes to readable messages.

These controls are implementation details, not a claim of complete production security.

## Testing

No automated unit, integration, or end-to-end test files/scripts are present in the repository at this time.

The frontend provides npm run lint and npm run build; the backend provides development and start scripts but no test script.

## Future improvements

Potential next steps, not current features:

- Participant registration records and eligibility management
- Submission metadata, repository/demo links, and file uploads
- Judge dashboards, assignment, criteria, and evaluations
- Leader reassignment and transactional/atomic capacity enforcement
- Email delivery and broader notification support
- Automated test coverage, API integration tests, and end-to-end browser tests
- Admin management for teams, submissions, and judging

## License

The repository’s backend package metadata declares the ISC license.
