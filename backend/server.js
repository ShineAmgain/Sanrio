const express = require('express');
const cors = require('cors');
require('dotenv').config();

const researchersRoutes = require('./routes/researchers');
const projectsRoutes = require('./routes/projects');
const publicationsRoutes = require('./routes/publications');
const eventsRoutes = require('./routes/events');
const grantsRoutes = require('./routes/grants');
const researchAreasRoutes = require('./routes/researchAreas');
const researchGroupsRoutes = require('./routes/researchGroups');
const resourcesRoutes = require('./routes/resources');
const announcementsRoutes = require('./routes/announcements');
const partnersRoutes = require('./routes/partners');
const statisticsRoutes = require('./routes/statistics');
const meetingsRoutes = require('./routes/meetings');
const activityLogRoutes = require('./routes/activitylog');



const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/researchers', researchersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/grants', grantsRoutes);
app.use('/api/research-areas', researchAreasRoutes);
app.use('/api/research-groups', researchGroupsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/meetings', meetingsRoutes);

app.get('/', (req, res) => res.send('R&D Digital Hub API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
