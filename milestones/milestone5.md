# Milestone 5

This document is completed during Unit 9. Check off deployment and evidence
tasks only after verifying them in the live application.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Deploy your project on Render
  - [x] In `readme.md`, add the link to your deployed project
- [x] Update the status of issues in your project board as you complete them
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [x] Under each feature you have completed, **include a GIF** showing feature functionality
- [x] In this document, complete the **Reflection** section below
- [x] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [x] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [x] Include this GIF in the **Final Demo GIF** section below

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
      👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project includes an Express backend app and a React frontend app
- [x] The project includes these backend-specific features:
  - [x] At least one of each of the following database relationships in Postgres
    - [x] one-to-many
    - [x] many-to-many with a join table
  - [x] A well-designed RESTful API that:
    - [x] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [x] the user can **view** items, such as tasks
      - [x] the user can **create** a new item, such as a task
      - [x] the user can **update** an existing item by changing some or all of its values, such as changing the title of task
      - [x] the user can **delete** an existing item, such as a task
    - [x] Routes follow proper naming conventions
  - [x] The web app includes the ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [x] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [x] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [x] Dynamic frontend routes created with React Router
  - [x] Hierarchically designed React components
    - [x] Components broken down into categories, including Page and Component types
    - [x] Corresponding container components and presenter components as appropriate
- [x] The project includes dynamic routes for both frontend and backend apps
- [x] The project is deployed on Render with all pages and features that are visible to the user are working as intended

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

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [ ] A subset of pages require the user to log in before accessing the content
  - [ ] Users can log in and log out via GitHub OAuth with Passport.js
- [ ] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [ ] Show a spinner while a page or page element is loading
- [x] Disable buttons and inputs during the form submission process
- [ ] Disable buttons after they have been clicked
  - _At least 75% of buttons in your app must exhibit this behavior to receive full credit_
- [ ] Users can upload images to the app and have them be stored on a cloud service
  - _A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality._
  - _Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post)._
  - _Selecting a photo from a list of provided photos does **NOT** count for this rubric item._
- [ ] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

(https://www.loom.com/share/d0b4bcf7e0a140a08fa024e510270d64)

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
