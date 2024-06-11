# Recipe Application

Recipe application is a mobile application that allows users to create, view, update, and delete their own recipes. Users can also view other recipes from the website and watch cooking lessons by simply clicking on the link to YouTube.

The application includes features such as login and register screens, a home screen, recipe search by categories, detailed recipe views, a feedback screen, and a calories screen to help calculate calories based on activities and weight.

## Key Features

### 🔑 Login and Register User Account
- Users can navigate to the login and register screens and perform the login and registration functions.

### 🔍 Search Recipe
- Users can search for recipes by entering keywords in the search bar. The app will fetch and display matching recipes based on the user’s input.

### 📂 Browse Recipe by Categories
- Users can find recipes by browsing through different food categories.

### 🍽️ Get Recipe of the Day
- Users can get a random recipe of the day by tapping the “Get Recipe of the Day” button.

### 📄 View Recipe
- Users can view the selected recipe on the Home Screen.

### 📝 Submit Feedback
- Users can submit feedback using a form with fields for their name, email address, the type of feedback, and remarks.

### 🍲 Display Own Recipes
- Users can view their own recipes stored in the SQLite database.

### ❌ Delete Recipes
- Users can delete recipes by pressing a "Delete" button. The app will first ask for confirmation before deleting the recipe from the database.

### ➕ Create Recipe
- Users can input and create a new recipe with a unique recipe ID, name, and description. The system will insert the new recipe into the database and update the instance variable of the OwnRecipeScreen.

### ✏️ Update Recipe
- Users can update the details of a recipe, including its name and description. The app will validate the input fields before allowing an update. The database operation will update the recipe where the recipeName, recipeDescription, and recipeID match the user's input.

### 👤 Display Profile
- Users can view their profile information, including their email.

## Screenshots

### 🔑 Login Screen
<p align="center">
  <img src="images/loginScreen.png" alt="Login Screen" width="300">
</p>

### 🏠 Home Screen
<p align="center">
  <img src="images/homeScreen.png" alt="Home Screen" width="300">
</p>

### 🎉 Welcome Screen
<p align="center">
  <img src="images/welcomeScreen.png" alt="Welcome Screen" width="300">
</p>

### 📋 View Recipe
<p align="center">
  <img src="images/viewScreen1.png" alt="View Recipe Screen 1" width="300">
  
</p>

### 🍲 Recipe Details and Actions
<p align="center">
  <img src="images/recipeScreen.png" alt="Recipe Details and Actions" width="300">
  <img src="images/recipeScreenResult.jpg" alt="Recipe Screen Result" width="300">
</p>

### 📂 Own Recipes
<p align="center">
  <img src="images/ownRecipeScreen.png" alt="Own Recipes Screen" width="300">
</p>

### ✏️ Update Recipe
<p align="center">
  <p align="center">
  <img src="images/updateRecipe.png" alt="Update Recipe Screen" width="300">
  </p>
  <p align="center">
  <img src="images/successUpdateRecipe.jpg" alt="Success Update Recipe" width="300">
    </p>
     <p align="center">
  <img src="images/errorUpdateRecipe.jpg" alt="Error Update Recipe" width="300">
       </p>
</p>

### 👤 Profile Screen
<p align="center">
  <img src="images/profileScreen.png" alt="Profile Screen" width="300">
</p>

