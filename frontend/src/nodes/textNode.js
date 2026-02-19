// textNode.js
// Text node as a state machine: text is the source of truth, handles are derived

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

/**
 * Parse {{variable}} patterns from text
 * Returns array of unique variable names
 */
const parseVariables = (text) => {
  const variablePattern = /\{\{(\w+)\}\}/g;
  const matches = [...text.matchAll(variablePattern)];
  const variables = matches.map(match => match[1]);
  // Return unique variables only
  return [...new Set(variables)];
};

/**
 * Calculate node width based on text length
 */
const calculateNodeWidth = (text) => {
  const baseWidth = 200;
  const maxWidth = 400;
  const charWidth = 8;
  const calculatedWidth = Math.max(baseWidth, Math.min(maxWidth, text.length * charWidth));
  return calculatedWidth;
};

// Move TextContent outside and make it stable
const TextContent = ({ id, data, onTextChange }) => {
  const handleChange = (e) => {
    const newText = e.target.value;
    // Notify parent of text change to update handles
    onTextChange?.(newText);
  };

  const handleKeyDown = (e) => {
    // Prevent node deletion when backspace is pressed in empty input
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  return (
    <label className="block">
      <span className="text-xs text-gray-600">Text:</span>
      <textarea 
        value={data?.text || ''} 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none resize-none"
        rows={3}
      />
      {/* Show detected variables */}
      {data?.variables?.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Variables: {data.variables.join(', ')}
        </div>
      )}
    </label>
  );
};

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState(200);

  // Update variables and node size when text changes
  useEffect(() => {
    const parsedVars = parseVariables(text);
    setVariables(parsedVars);
    setNodeWidth(calculateNodeWidth(text));
  }, [text]);

  // Generate handles deterministically from variables
  const handles = useMemo(() => [
    // Target handles (left side) - one for each variable
    ...variables.map((variable, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${variable}`,
      style: { 
        top: `${((index + 1) * 100) / (variables.length + 1)}%` 
      }
    })),
    // Source handle (right side) - output
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ], [variables, id]);

  const handleTextChange = useCallback((newText) => {
    setText(newText);
  }, []);

  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Text',
        icon: '',
        text,
        variables,
        content: TextContent,
        onTextChange: handleTextChange,
        handles,
        customStyle: {
          width: `${nodeWidth}px`
        }
      }}
    />
  );
};
