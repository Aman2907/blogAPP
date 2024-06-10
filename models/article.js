const { pool } = require("../dbConfig");
// const marked = require("marked")
// const Slugify  = require('slugify')


// Function to create a new article
const createArticle = async ({ title, description, markdown }) => {
  const result = await pool.query(
    `INSERT INTO articles (title, description, markdown)
     VALUES ($1, $2, $3) RETURNING *`,
    [title, description, markdown]
  );
  return result.rows[0];
};

// Function to get all articles
const getArticles = async () => {
  const result = await pool.query('SELECT * FROM articles');
  return result.rows;
};

// Function to get an article by ID
async function getArticleById(id) {
  const query = `
    SELECT * FROM articles WHERE id = $1;
  `;
  const values = [id];

  const client = await pool.connect();
  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
}


const deleteArticle = async (id) => {
  const query = `
    DELETE FROM articles
    WHERE id = $1;
  `;
  await pool.query(query, [id]);
};





module.exports = {
    createArticle,
    getArticles,
    getArticleById ,
    deleteArticle,
  
};