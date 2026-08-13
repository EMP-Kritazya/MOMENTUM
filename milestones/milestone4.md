# Milestone 4

This document should be completed and submitted during **Unit 8** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [x] In this document, complete all five questions in the **Reflection** section below.

### Sprint Issues

- [x] **Implement database seeding for initial application data**
- [x] **Frontend: Set up Sidebar**
- [x] **Personalized Onboarding: Create user onboarding database schema and API routing**
- [x] **Initialize Vite/React for the client side**
  - Description: Build client

## Reflection

### 1. What went well during this unit?

Our team made strong progress on the frontend foundation. We initialized the React client with Vite, added shared routing and a sidebar layout, and built a responsive multi-step personalized onboarding experience. Separating reusable UI components from onboarding-specific components also made the code easier to understand and extend.

### 2. What were some challenges your group faced in this unit?

One challenge was keeping the frontend onboarding fields aligned with the PostgreSQL user schema. The interface collects profile information, workout location, and multiple equipment choices, but the original database schema did not support every value in the same format. Coordinating changes across team branches and resolving merge conflicts also required extra care.

### 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We completed all the tasks in our sprint plan this week.

### 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

The Daily Workout Generator and Accountability Groups are most at risk because they depend on reliable seeded data, database relationships, and working API routes. If they remain at risk, we will focus first on a complete vertical slice: create one user through onboarding, generate or assign one workout, save one workout session, and display it on the dashboard before expanding the feature set.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We may need support on testing the complete React-to-Express-to-PostgreSQL flow and preparing the application for Render deployment would also be helpful.
