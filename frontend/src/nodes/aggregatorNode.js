// aggregatorNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const AggregatorContent = ({ id, data }) => {
  const [aggType, setAggType] = useState(data?.aggType || 'Merge');

  return (
    <label className="block">
      <span className="text-xs text-gray-600">Type:</span>
      <AnimatedSelect
        value={aggType}
        onChange={(e) => setAggType(e.target.value)}
        options={['Merge', 'Concat', 'Join']}
      />
    </label>
  );
};

export const AggregatorNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Aggregator',
        icon: '',
        content: AggregatorContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-input1`, style: { top: '25%' } },
          { type: 'target', position: Position.Left, id: `${id}-input2`, style: { top: '50%' } },
          { type: 'target', position: Position.Left, id: `${id}-input3`, style: { top: '75%' } },
          { type: 'source', position: Position.Right, id: `${id}-output` }
        ]
      }}
    />
  );
};
