import express from 'express';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to get image files
app.get('/api/images', async (req, res) => {
  try {
    const files = await readdir(join(__dirname, 'public/images'));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error reading directory' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});