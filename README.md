Summary of  my Approach for this Task: <br/>
**Objective**: <br/>
To add user authentication functionality, allowing users to register, log in,maintain sessions, Post Blog and CRUD Operation. <br/>


Strucuture  of Assignment <br/>
|-- /models <br/>
    |   |-- /article.js <br/>
|-- /Node_modules <br/>
|-- /routes <br/>
    |   |-- /article.js <br/>
|-- /Views <br/>
    |   |-- /articles <br/>
             |       |-- /aman.ejs <br/>
             |       |-- /Dashboard.ejs <br/>
             |       |-- /Form_field.ejs <br/>
     |   |-- /images <br/>
     |   |-- index.css <br/>
     |   |-- Index.ejs <br/>
     |   |-- login.ejs <br/>
     |   |-- Register.ejs <br/>
     |   |-- show.ejs <br/>
|-- /.env <br/>
|-- /dbConfig.js <br/>
|-- /Package.json <br/>
|-- /Package.lock.json <br/>
|-- /passportConfig.js <br/>
|-- /server.js <br/>







### Prerequisites <br/>
- Node.js <br/>
- npm (Node Package Manager) <br/>
- MongoDB <br/>
- Git <br/>

**Approach**:
1. **Database Schema Design**: <br/>
 #Added a `Users` table with columns for `id`, `Name`, `email`, `password`. <br/>

# Added a `articles` table with columns for `post title`, `Description`, `markdown`. <br/>

#/articles/aman - Its used to create post with title, description and marddown  <br/>


2. **Authentication Logic**:
   - Used JWT for token-based authentication. 
   - Implemented middleware to protect routes
   - passportConfig
3. **Endpoints**:
   - `POST /api/auth/register`: For user registration.
   - `POST /api/auth/login`: For user login.


4   Create a `.env` file in the root directory and add the following:
    ```env
 JWT_SECRET=your_jwt_secret


5 User Authentication
- **Register:** Go to `/register` and fill out the registration form.
- **Login:** Go to `/login` and enter your credentials.
- **Logout:** Click on the logout link in the navigation bar.

6 ### Managing Blog Posts
- **Create a Post:**
    - Go to DASHBOARD After login  `/posts/new`
    - Fill out the form with the post title, content, category, and tags.
    - Click `Submit` to publish the post.
