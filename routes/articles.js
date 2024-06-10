const express = require("express")
const router = express.Router()
const {
  createArticle,
  getArticles,
  getArticleById,
  deleteArticle,
  updateArticle
} = require('../models/article');


router.get('/aman', (req, res) => {
  res.render('articles/aman')
}) 

router.get('/:id', async (req, res) => {
  const articleId = req.params.id;
  try {
    const article = await getArticleById(articleId); // Implement this function in your model
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.render('articles/show', { article }); // Assuming 'show.ejs' is your template file
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, markdown, created_at } = req.body;
  try {
    const newArticle = await createArticle({ title, description, markdown, created_at });
    res.status(201).render('show', { article: newArticle });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/users/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteArticle(id);
    res.status(204).json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;