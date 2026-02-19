// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const InputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs text-gray-600">Name:</span>
        <input 
          type="text" 
          value={currName} 
          onChange={(e) => setCurrName(e.target.value)}
          className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1"
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-600">Type:</span>
        <AnimatedSelect
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          options={['Text', 'File']}
        />
      </label>
    </div>
  );
};

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Input',
        icon: '→',
        content: InputContent,
        handles: [
          { type: 'source', position: Position.Right, id: `${id}-value` }
        ]
      }}
    />
  );
}
