// outputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const OutputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs text-gray-600">Name:</span>
        <input 
          type="text" 
          value={currName} 
          onChange={(e) => setCurrName(e.target.value)}
          className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-600">Type:</span>
        <AnimatedSelect
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
          options={['Text', 'Image']}
        />
      </label>
    </div>
  );
};

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Output',
        icon: '',
        content: OutputContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-value` }
        ]
      }}
    />
  );
}
