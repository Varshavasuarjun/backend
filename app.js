const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://HarshaVilasraoNikhade:Harsha1234@cluster0.znhrbrv.mongodb.net/blog?retryWrites=true&w=majority',  {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB Atlas', error);
    });

const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    urlToImage: String,
    publishedAt: {
        type: Date,
        default: new Date()
    }
});

const Blog = mongoose.model('Blog', blogSchema);

// GET all blog data
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog data' });
    }
});

// GET a single blog data by ID
app.get('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog data not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog data' });
    }
});

// POST a new blog data
app.post('/api/blogs', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const blog = new Blog({ title, content, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create blog data' });
    }
});

// PUT update a blog data
app.put('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content, author }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog data not found' });
        }
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog data' });
    }
});

// DELETE a blog data
app.delete('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog data not found' });
        }
        res.json({ message: 'Blog data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog data' });
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
