const express = require('express')
const app = express()
const port = 3000
const articleRouter = require("./routes/articles")
const { pool } = require("./dbConfig")
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config(); 
const bodyParser = require('body-parser');
const passport = require("passport")
const path = require('path');
const methodOverride = require("method-override")



const initializePassport = require("./passportConfig");
const { title } = require('process');


initializePassport(passport);
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

 

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

   
// how we use ejs file 
app.get('/', (req, res) => {
  res.render('Index.ejs')
}) 

app.get('/users/register', checkAuthenticated, (req, res) => {
  res.render("register.ejs")
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  res.render("login.ejs")
})
   
app.use('/articles', articleRouter)
 
app.get('/users/Dashboard', checkNotAuthenticated, async (req, res) => {
  try {  
    const result = await pool.query('SELECT title, description, created_at FROM articles ORDER BY created_at DESC');
    const articles = result.rows;
 
    res.render('articles/Dashboard.ejs', {
      user: req.user.name, 
      articles: articles
    }); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})


// app.delete('/users/Dashboard/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await deleteArticle(id);
//     res.status(204).json({ message: 'Article deleted successfully' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

 
app.get('/users/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/users/login');
  });
});


app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  })

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {

  let hashedpassword = await bcrypt.hash(password, 10);
  console.log(hashedpassword)


  // It will check whether user already exist or not
  pool.query(
    `SELECT * FROM users
     WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" })
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
              VALUES ($1, $2, $3)
              RETURNING id, password`,
            [name, email, hashedpassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    )
  }
})

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/Dashboard");
  }
  next();
}  

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
