// validatorNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const ValidatorContent = () => {
  return (
    <div className="text-xs text-gray-500">
      <p className="m-0">Validates data format</p>
      <small>✓ Schema check</small>
    </div>
  );
};

export const ValidatorNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Validator',
        icon: '✓',
        content: ValidatorContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-input` },
          { type: 'source', position: Position.Right, id: `${id}-valid`, style: { top: '40%' } },
          { type: 'source', position: Position.Right, id: `${id}-invalid`, style: { top: '70%' } }
        ]
      }}
    />
  );
};
