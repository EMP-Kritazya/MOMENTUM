# Milestone 5

This document is completed during Unit 9. Check off deployment and evidence
tasks only after verifying them in the live application.

## Checklist

- [x] Deploy the complete project on Render
  - [x] Add the deployed client URL to `README.md`
- [x] Update completed issues on the GitHub project board
- [x] Mark completed README features with a ✅ emoji
  - [x] Include a working GIF under every completed feature
- [x] Complete the Reflection section
- [x] Complete the Final Project Feature Checklist based on implemented code
- [x] Record one complete final-project walkthrough GIF
  - [x] Add it to the Final Demo GIF section

## Final Project Feature Checklist

### Baseline Features

- [x] The project includes an Express backend and React frontend
- [x] The project includes backend-specific features:
  - [x] At least one of each required PostgreSQL relationship:
    - [x] One-to-many: `Users` to `WorkoutSessions`
    - [x] Many-to-many with a join table: `Users` to
      `AccountabilityGroups` through `GroupMembers`
  - [x] A RESTful API that supports GET, POST, PATCH, and DELETE
    - [x] Items can be viewed through GET endpoints
    - [x] Items can be created through POST endpoints
    - [x] Items can be updated through PATCH endpoints
    - [x] Items can be deleted through DELETE endpoints
    - [x] Routes follow REST naming conventions
  - [x] The database can be intentionally reset to its default state
- [x] The project includes frontend-specific features:
  - [x] React Router navigation redirects users to new application URLs
  - [x] Users can open and complete modal/form interactions without navigating
  - [x] Frontend routes are defined with React Router
  - [x] React components are organized hierarchically
    - [x] The client separates pages, layouts, and reusable components
    - [x] Container pages compose presentation components
- [x] The project includes parameterized dynamic routes in both frontend and
  backend applications
  - Backend parameterized routes are complete; the frontend currently uses
    static application routes.
- [x] The project is deployed on Render with every claimed page working

### Custom Features

- [x] The project gracefully handles API, validation, loading, and empty states
- [ ] The project includes a one-to-one database relationship
- [x] Workout details and group creation use same-page modal interactions
- [x] `GroupMembers` includes `UNIQUE(group_id, user_id)`
- [x] `POST /api/groups/join` is a custom invite-code action
- [x] Workout history can be filtered and sorted
- [ ] Data is automatically generated after a qualifying user action
- [x] Onboarding POST data is validated before PostgreSQL is updated
  - The final walkthrough must include an invalid submission being rejected.

### Stretch Features

- [ ] A subset of frontend pages require login before they can be opened
  - [ ] Users can log in and out through GitHub OAuth with Passport.js
- [ ] Available user options are dynamically restricted
- [ ] A visual spinner is displayed while content loads
- [x] Important submission buttons are disabled while requests are running
- [ ] At least 75% of buttons remain disabled after being clicked
- [ ] Users can upload images to a cloud service
- [ ] Toast messages provide feedback for user events

## Final Demo GIF

🔗 **TODO: Upload the final walkthrough GIF to GitHub and paste its link here.**

The walkthrough should demonstrate:

1. Onboarding and rejected invalid input.
2. Navigation through the shared application layout.
3. Workout-history filtering and the detail modal, if working in production.
4. Creating an accountability group.
5. Joining with an invite code from another authenticated account.
6. Member status and leaving a group.
7. Administrator login and a protected administrator action, if exposed in
   the deployed interface.

## Reflection

### 1. What went well during this unit?

Our group successfully combined independently developed frontend and backend
features into one full-stack application. We improved the separation between
pages, reusable components, API modules, controllers, routes, and middleware.
We also connected onboarding and accountability groups to PostgreSQL while
adding validation, authentication, and clear loading and error feedback.

### 2. What were some challenges your group faced in this unit?

The largest challenge was integrating branches that had evolved in different
directions. We encountered dependency conflicts, duplicate controller logic,
inconsistent API response assumptions, and differences between local and
production configuration. We addressed these problems by testing one boundary
at a time, centralizing API requests, and making authenticated identity come
from the verified server cookie.

### 3. What achievements are you most proud of?

We are proud of the multi-step onboarding experience, responsive workout
history interface, and authenticated accountability-group workflow. The Groups
feature demonstrates a many-to-many relationship, invite-code joining,
transactional group creation, membership status, and group-level authorization
in one cohesive feature.

### 4. How have you grown since the beginning of the course?

We have moved from building isolated components to reasoning about an entire
full-stack system. We now understand how database constraints, Express routes,
controllers, authentication middleware, API clients, React state, and
deployment configuration affect one another. We also became more deliberate
about validation, error handling, Git collaboration, and testing before
merging changes.

### 5. What are your future web-development goals?

Our next goals are to complete live dashboard and Exercise Library integration,
add frontend route guards, create repeatable database migrations, and improve
automated testing. We plan to reach these goals by building smaller features
end to end, adding tests alongside each API boundary, and continuing to deploy
projects so production concerns are considered throughout development.
