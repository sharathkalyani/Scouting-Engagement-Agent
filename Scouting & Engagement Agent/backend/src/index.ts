import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'Talent Scouting & Engagement Agent API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      parse_jd: 'POST /api/parse-jd',
      find_candidates: 'POST /api/find-candidates',
      engage_candidate: 'POST /api/engage-candidate',
      generate_shortlist: 'POST /api/generate-shortlist',
      full_pipeline: 'POST /api/full-pipeline',
    },
    docs: 'See README.md for local setup and API examples.',
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/`);
});

export default app;
