const express = require('express');
const cors = require('cors');
require('dotenv').config();

const researchersRoutes = require('./routes/researchers');
const projectsRoutes = require('./routes/projects');
const publicationsRoutes = require('./routes/publications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/researchers', researchersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/publications', publicationsRoutes);

app.get('/', (req, res) => res.send('R&D Digital Hub API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));