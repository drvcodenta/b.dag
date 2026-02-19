// transformNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const TransformContent = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'Uppercase');

  return (
    <label className="block">
      <span className="text-xs text-gray-600">Operation:</span>
      <AnimatedSelect
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        options={['Uppercase', 'Lowercase', 'Trim', 'Reverse']}
      />
    </label>
  );
};

export const TransformNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Transform',
        icon: '',
        content: TransformContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-input` },
          { type: 'source', position: Position.Right, id: `${id}-output`, style: { top: '40%' } },
          { type: 'source', position: Position.Right, id: `${id}-metadata`, style: { top: '70%' } }
        ]
      }}
    />
  );
};
