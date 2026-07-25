# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

You will need to reference the GitHub Project Management guide in the course portal for more information about how to complete each of these steps.

- [x] In your repo, create a project board.
  - *Please be sure to share your project board with the grading team's GitHub **codepathreview**. This is separate from your repository's sharing settings.*
- [x] In your repo, create at least 5 issues from the features on your feature list.
  - List the title of each issue you created:
    1. Repo Setup Task (#1)
    2. Project Setup: Backend & Database (#3)
    3. Personalized Onboarding: Basic multi-step onboarding questionnaire UI (#4)
    4. Feature: Build Search and Filter API for Exercise Directory
    5. Feature: Design Community Hub Shell and group creation UI
- [x] In your repo, update the status of issues in your project board.
- [x] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
  - List the name of each milestone you created:
    1. Milestone 1 - Unit 5
    2. Milestone 2 - Unit 6
    3. Milestone 3 - Unit 7
    4. Milestone 4 - Unit 8
    5. Milestone 5 - Unit 9
  - [x] Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [x] Under each feature you have completed, include a GIF showing feature functionality.
- [x] In this documents, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

Completing our initial full-stack environment scaffolding and baseline feature structures went exceptionally well. Setting up our global repository, configuring our local Express servers and testing our connection pooling strings for PostgreSQL, building out our client-side state handling components for the Personalized Onboarding

### 2. What were some challenges your group faced in this unit?

Our biggest challenge was maintaining seamless configuration setups for the local database. We also had to work closely on layout state management to ensure that our multi-step questionnaire cards stayed perfectly responsive in Tailwind.

### 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

Yes, our team successfully completed all core high-priority architectural setup sprint objectives assigned for the Milestone 3 boundary. If our secondary exercise filtering layers had hit any minor delays, our priority plan was to focus entirely on finishing the onboarding user submission pipeline (`POST /api/users`) first to secure core platform data persistence before spending development cycles styling secondary visualization layouts.

### 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

The most technically complex user story at risk is our custom relational workout generation query block. Because it pulls data combined across our automated tracking template junction mapping system (`WorkoutTemplates` and `WorkoutTemplateExercises`) based directly on captured profile objectives, writing accurate SQL joins can be prone to logical bugs. If this logic remains at risk or experiences blockers next week, we will pivot to serving a reliable static subset of primary presets to guarantee core feature stability, allowing us to implement granular filtering elements progressively.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

As we jump out of the initial template layout shell phase and move deep into dynamic transactional logic for Milestone 4, we will benefit heavily from advanced optimization advice for complex PostgreSQL operations. Specifically, getting peer insight on building optimal multi-table relational `INNER JOIN` queries—and efficiently scaling mathematical updates to calculate user consistency streaks inside our `group_members` table—will keep our app fast and bug-free.