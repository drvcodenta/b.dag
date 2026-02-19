// toolbar.js

import { DraggableNode } from './draggableNode';
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

export const PipelineToolbar = () => {
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

            const result = await response.json();
            setValidationResult(result.is_dag);
            
            setDialogData(result);
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
                {/* Left side - Logo and nodes */}
                <div className="flex items-center gap-6">
                    {/* VS Logo */}
                    <div className="flex items-center gap-2">
                        <img 
                            src="/logo192.png" 
                            alt="VS" 
                            className="w-10 h-10"
                        />
                    </div>
                    
                    {/* Draggable Nodes */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <DraggableNode type='customInput' label='Input' />
                        <DraggableNode type='llm' label='LLM' />
                        <DraggableNode type='customOutput' label='Output' />
                        <DraggableNode type='text' label='Text' />
                        <DraggableNode type='filter' label='Filter' />
                        <DraggableNode type='transform' label='Transform' />
                        <DraggableNode type='api' label='API' />
                        <DraggableNode type='validator' label='Validator' />
                        <DraggableNode type='aggregator' label='Aggregator' />
                    </div>
                </div>
                
                {/* Right side - Controls */}
                <div className="flex items-center gap-4">
                    
                    {/* Submit/Play Button */}
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#6467f1] hover:bg-[#6467f9] text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg"
                        title="Run Pipeline"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <Dialog data={dialogData} onClose={() => setDialogData(null)} />
        </>
    );
};
