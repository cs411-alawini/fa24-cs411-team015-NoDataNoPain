# Project Proposal

## ICare (Health Management System)

## Summary
In recent years, there has been a growing emphasis on personal health and fitness, with many individuals making a concerted effort to maintain a healthier lifestyle. Regular exercise has become a crucial part of daily routines, and people are more mindful than ever about what they consume, paying close attention to the nutritional content of their meals. To cater to this trend, we aim to develop a comprehensive calorie management system that enables users to effortlessly monitor their daily caloric intake.

## Description
This system will provide an easy-to-use platform for logging meals, snacks, and beverages, offering insights into their nutritional value and helping users make informed decisions about their diet. By offering personalized recommendations and progress tracking, our system will empower users to take control of their health and achieve their health and fitness goals more effectively. Additionally, we aim to enhance the user experience by offering personalized fitness and meal plan recommendations through an embedded AI API. This AI-driven system will analyze user data, such as fitness goals, dietary preferences, and activity levels, to create tailored workout routines and meal plans.

## Challenging features
An embedded AI feature that provides real-time recommendations and personalizes the user's training and meal plan for daily use.

## Usefulness
* Basic functionality includes tracking the user's daily calorie intake and exercise levels depending on user input, while also generating a weekly report based on the user's performance from the previous week.
* Provides information on different exercises fetched from a chosen dataset. 
* Recommendation of workout plan and recipe of the day using AI API (Google Gemini).

## Realness
We will be utilizing several real-world datasets, including the Gym Exercise Dataset and the Food and Their Calories Dataset, to enhance the user experience within our application. These datasets will provide accurate and diverse information, allowing for more personalized and effective recommendations for users.

Gym Exercise Dataset: https://www.kaggle.com/datasets/niharika41298/gym-exercise-data

Food and Their Calories Dataset: https://www.kaggle.com/datasets/vaishnavivenkatesan/food-and-their-calories

For weather information, we will be using available APIs for real-time weather data such as *openweathermap* and filter its data to customize different user locations.

## Functionality
* Able to create, delete, update, and save their meals, snacks, and exercises of the day.
* Able to create a weekly report for the previous week.
* Able to get recommandations of exercise and recipe for the next week and view it any time.
* Able to view local weather information.
* Able to view workout information (integrates weather updates for recommendations).

### Low-fedility Model
![alt text](https://github.com/cs411-alawini/fa24-cs411-team015-NoDataNoPain/blob/main/doc/Low-Fedility%20Model.png)

### Work Distribution
* Client-Side Logic; UI/Interaction; Database error handling (Runzhong Li)
* Data integration and pre-processing; Assisting frontend (Yanze Lu)
* Database management and API calling (Yichen Liu) 
* Database management and other Server-Side logic (Ying Chen)

