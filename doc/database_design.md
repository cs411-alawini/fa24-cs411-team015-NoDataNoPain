# Relational Schema:

1. User(User_Id: INT [PK], Username: VARCHAR(30), Height: INT, Weight: INT, Age: INT, Prompt_Id: INT [FK to Prompt.Prompt_Id]) 
    - Since our software is dynamic and differs per user, user must be its own entity with characteristics of the user like height and weight
    - One-to-many relationship: user to meals through User_Id—user can have multiple non-unique meals. 
    - One-to-many relationship: user to exercises through User_Id—user can have multiple non-uniqnue exercise sets
    - One-to-one relationship: user to reports (weekly), through the User_Id, and user to prompt via prompt_id, both are unique to a user and report is time based

2. Meals(Meal_Id: INT [**PK**], User_Id: INT [**FK to User.User_Id**], FoodName: VARCHAR(30) [**FK to Food.FoodName**], DrinkName: VARCHAR(30) [**FK to Drinks.DrinkName**], Time: DATETIME)
    - Each meal is logged with details of many food and drink consumed at specific times, and can be referred to in the report, so it must be its own entity. 
    - One-to-many relationship: to food via FoodName—many food can be included in one meal
    - One-to-many relationship: to drink via DrinkName, similar to food
    - Many-to-one relationship: to user through User_Id—one meal can be assigned to a user multiple times

3. Exercises(Exercises_Id: INT [**PK**], User_Id: INT [**FK to User.User_Id**], Exercise_Name: VARCHAR(30), Rep: INT, Set: INT, Time: TIME)
    - Each exercise contains many attributes such as reps, sets, and the time required, so it must be its own entity. 
    - Many-to-one relationship: to user via User_Id

4. Food(FoodName: VARCHAR(30) [**PK**], Nutrition_Type: VARCHAR(30), Calories_Per_Gram: INT, Quantity: INT)
    - Each solid food contains nutritional info and a quantity, so it is its own entity
    - Many-to-one relationship: to meals via FoodName. 

5. Drinks(DrinkName: VARCHAR(30) [**PK**], Nutrition_Type: VARCHAR(30), Calories_Per_Gram: INT, Quantity: INT)
    - Each drink contains nutritional info and a quantity, so it is its own entity
    - Many-to-one relationship: to meals via DrinkName

6. Prompt(Prompt_Id: INT [**PK**], Description: VARCHAR(300))
    - Each prompt generates content for a user, so it contains its own prompt_id and description, being its own entity. Will be removed after use. 
    - One-to-one relationship: to user via User_Id

7. Report(Report_Id: INT [**PK**], User_Id: INT [**FK to User.User_Id**], Description: VARCHAR(300), Time: DATETIME)
    - Report contains its own description and time created, and will be unioned with meals later on to contain meal information. 
    - One-to-one relationship: to user via User_Id——one unique report per week corresponds to each user
  
---

# Prove the Schema is 3NF

The schema is 3NF if it is 1NF (atomic values and single-valued attributes) and 2NF(no partial dependency), also it has no transitive dependency.

1. User: all attributes are directly dependent on User_Id. No transitive dependency.
2. Meals: User_Id is a foreign key, linking the meal to a user, but it does not participate in defining other attributes. Other attributes are all dependent on Meal_Id. No transitive dependency.
3. Exercises: User_Id is a foreign key, linking the exercise to a user, but it does not participate in defining other attributes. Other attributes are all dependent on Exercises_Id. No transitive dependency.
4. Food: all attributes are directly dependent on FoodName. No transitive dependency.
5. Drink: all attributes are directly dependent on DrinkName. No transitive dependency.
6. Prompt: User_Id is a foreign key, linking the prompt to a user, but it does not participate in defining other attributes. Other attributes are all dependent on Prompt_Id. No transitive dependency.
7. Report: User_Id is a foreign key, linking the report to a user, but it does not participate in defining other attributes. Other attributes are all dependent on Report_Id. No transitive dependency.

In conclusion, in each of the tables, every non-prime attribute depends only on the primary key and does not depend on any other non-prime attribute. This means that there are no transitive dependencies in any of the tables. Therefore, this relational schema is in 3NF.
