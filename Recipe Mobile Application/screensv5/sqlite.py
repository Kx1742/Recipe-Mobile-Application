import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
db = sqlite3.connect('recipe.sqlite')

# Create the 'recipe' table
db.execute('''
    CREATE TABLE recipe (
        id integer PRIMARY key,
        recipeID integer NOT NULL,
        recipeName text NOT NULL,
        recipeEmail text NOT NULL,
        recipeDescription text NOT NULL
        )
''')

# Create a cursor for executing SQL statements
cursor = db.cursor()

# Insert data into the 'recipe' table
cursor.execute('''INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription)
               VALUES (52874, 'Beef and Mustard Pie', 'test@gmail.com', 'Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.')''')

cursor.execute('''INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription)
               VALUES (52874, 'Beef and Mustard Pie', 'test@gmail.com', 'Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.')''')

cursor.execute('''INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription)
                  VALUES (52874, 'Beef and Mustard Pie', 'test1@gmail.com', 'Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.')''')

# Commit the changes and close the database connection
db.commit()
db.close()
