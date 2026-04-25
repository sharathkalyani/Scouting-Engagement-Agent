import { useState } from 'react';
import axios from 'axios';
import './App.css';
import ProcessingPanel from './components/ProcessingPanel';
import ShortlistDisplay from './components/ShortlistDisplay';
import { ProcessingState, PipelineResult } from './types';
import { SAMPLE_JOB_DESCRIPTION } from './constants';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    step: 'idle',
    progress: 0,
    current_action: '',
  });
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setError('');
    setResult(null);
    setProcessing(true);

    try {
      setProcessingState({ step: 'parsing_jd', progress: 15, current_action: 'Parsing the job description...' });
      await wait(150);
      setProcessingState({ step: 'finding_candidates', progress: 40, current_action: 'Discovering candidate matches...' });
      await wait(150);
      setProcessingState({ step: 'engaging', progress: 70, current_action: 'Running simulated outreach and interest checks...' });

      const response = await axios.post('/api/full-pipeline', {
        job_description: jobDescription,
        limit: 10,
        engagement_turns: 2,
        match_weight: 0.5,
      });

      setProcessingState({
        step: 'generating_shortlist',
        progress: 90,
        current_action: 'Ranking candidates and preparing recommendations...',
      });
      await wait(150);

      if (response.data.success) {
        setResult(response.data.data as PipelineResult);
        setProcessingState({ step: 'complete', progress: 100, current_action: 'Shortlist ready.' });
      } else {
        setError(response.data.error || 'Failed to process job description');
        setProcessingState({ step: 'error', progress: 0, current_action: 'Error occurred' });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      setProcessingState({
        step: 'error',
        progress: 0,
        current_action: errorMessage,
        error: errorMessage,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Talent Scouting & Engagement Agent</h1>
              <p>AI-assisted candidate discovery, simulated outreach, and recruiter-ready ranking.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content container">
        <div className="two-column-layout">
          <div className="input-section">
            <div className="card">
              <h2>Job Description</h2>
              <p className="section-copy">
                Paste a JD and the agent will parse requirements, match the mock talent pool, simulate outreach, and rank the best candidates by fit and interest.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="jobDesc">Enter Job Description</label>
                  <textarea
                    id="jobDesc"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    placeholder="Paste a complete job description here. Include title, responsibilities, requirements, and qualifications."
                    disabled={processing}
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={processing} style={{ width: '100%' }}>
                  {processing ? (
                    <>
                      <span className="loader"></span> Processing...
                    </>
                  ) : (
                    'Find and Engage Candidates'
                  )}
                </button>
              </form>

              <div className="sample-section mt-20">
                <p className="text-muted">
                  <strong>Need an example?</strong>
                </p>
                <button className="btn btn-secondary" onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)} disabled={processing}>
                  Load Sample Job
                </button>
              </div>
            </div>
          </div>

          <div className="output-section">
            {processingState.step !== 'idle' && <ProcessingPanel state={processingState} />}
            {result && processingState.step === 'complete' && <ShortlistDisplay result={result} />}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Talent Scouting & Engagement Agent v1.0</p>
        </div>
      </footer>
    </div>
  );
}
