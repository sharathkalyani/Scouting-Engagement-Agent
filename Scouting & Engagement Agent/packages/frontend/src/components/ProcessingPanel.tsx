import { ProcessingState } from '../types';

interface ProcessingPanelProps {
  state: ProcessingState;
}

export default function ProcessingPanel({ state }: ProcessingPanelProps) {
  const steps = [
    { name: 'Parsing JD', icon: 'JD', key: 'parsing_jd' },
    { name: 'Finding Candidates', icon: 'M', key: 'finding_candidates' },
    { name: 'Engaging Candidates', icon: 'C', key: 'engaging' },
    { name: 'Generating Shortlist', icon: 'R', key: 'generating_shortlist' },
  ];

  const getStepStatus = (stepKey: string) => {
    const stateSteps = ['parsing_jd', 'finding_candidates', 'engaging', 'generating_shortlist'];
    const currentIndex = stateSteps.indexOf(state.step);
    const stepIndex = stateSteps.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="processing-panel">
      <h3 style={{ marginBottom: '20px' }}>Processing Your Job Description</h3>

      {steps.map((step) => {
        const status = getStepStatus(step.key);

        return (
          <div
            key={step.key}
            className="processing-step"
            style={{
              opacity: status === 'pending' ? 0.5 : 1,
              background: status === 'completed' ? 'rgba(15, 118, 110, 0.08)' : '#f8fafc',
            }}
          >
            <div className="step-icon">
              {status === 'completed' && 'OK'}
              {status === 'in-progress' && <span className="loader" style={{ display: 'inline-block' }}></span>}
              {status === 'pending' && step.icon}
            </div>
            <div className="step-content">
              <div className="step-title">{step.name}</div>
              {status === 'in-progress' && <div className="step-indicator">Running...</div>}
              {status === 'completed' && <div className="step-indicator" style={{ color: '#0f766e' }}>Completed</div>}
            </div>
          </div>
        );
      })}

      <div className="progress-bar" style={{ marginTop: '20px' }}>
        <div className="progress-fill" style={{ width: `${state.progress}%` }}></div>
      </div>

      <div style={{ marginTop: '15px', fontSize: '13px', color: '#64748b' }}>{state.current_action}</div>
    </div>
  );
}
