// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const LLMContent = () => {
  return (
    <div className="text-xs text-gray-500">
      <span>This is a LLM.</span>
    </div>
  );
};

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'LLM',
        icon: '',
        content: LLMContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: `${100/3}%` } },
          { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: `${200/3}%` } },
          { type: 'source', position: Position.Right, id: `${id}-response` }
        ]
      }}
    />
  );
}
