// apiNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const APIContent = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [endpoint, setEndpoint] = useState(data?.endpoint || '/api/data');

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs text-gray-600">Method:</span>
        <AnimatedSelect
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          options={['GET', 'POST', 'PUT', 'DELETE']}
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-600">Endpoint:</span>
        <input 
          type="text" 
          value={endpoint} 
          onChange={(e) => setEndpoint(e.target.value)} 
          placeholder="/api/endpoint"
          className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </label>
    </div>
  );
};

export const APINode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'API',
        icon: '🌐',
        content: APIContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-params`, style: { top: '30%' } },
          { type: 'target', position: Position.Left, id: `${id}-body`, style: { top: '60%' } },
          { type: 'source', position: Position.Right, id: `${id}-response` }
        ]
      }}
    />
  );
};
