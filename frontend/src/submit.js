// submit.js
// Minimal UI response: show backend result, no retries, no assumptions

import { useStore } from './store';
import { useState } from 'react';

// Custom Dialog Component
const Dialog = ({ data, onClose }) => {
    if (!data) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Pipeline Analysis</h2>
                <div className="dialog-content">
                    <div className="dialog-field">
                        <span className="dialog-label">Nodes</span>
                        <span className="dialog-value">{data.num_nodes}</span>
                    </div>
                    <div className="dialog-field">
                        <span className="dialog-label">Edges</span>
                        <span className="dialog-value">{data.num_edges}</span>
                    </div>
                    <div className="dialog-field">
                        <span className="dialog-label">Is DAG</span>
                        <span className={`dialog-value ${data.is_dag ? 'success' : 'error'}`}>
                            {data.is_dag ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>
                </div>
                <button className="dialog-button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export const SubmitButton = () => {
    const { getPipelineState, setValidationResult } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogData, setDialogData] = useState(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            const pipelineState = getPipelineState();
            
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineState),
            });

            // Get backend response
            const result = await response.json();
            
            // Store validation result
            setValidationResult(result.is_dag);
            
            // Show custom dialog with result
            setDialogData(result);
            
        } catch (error) {
            // Show error - no retry
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            <Dialog data={dialogData} onClose={() => setDialogData(null)} />
        </>
    );
}
