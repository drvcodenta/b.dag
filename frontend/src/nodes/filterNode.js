// filterNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AnimatedSelect } from '../AnimatedSelect';

const FilterContent = ({ id, data }) => {
  const [filterType, setFilterType] = useState(data?.filterType || 'Contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs text-gray-600">Filter:</span>
        <AnimatedSelect
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={['Contains', 'Equals', 'Starts With', 'Ends With']}
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-600">Value:</span>
        <input 
          type="text" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)} 
          placeholder="Filter value"
          className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
        />
      </label>
    </div>
  );
};

export const FilterNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        nodeType: 'Filter',
        icon: '⚙',
        content: FilterContent,
        handles: [
          { type: 'target', position: Position.Left, id: `${id}-input` },
          { type: 'source', position: Position.Right, id: `${id}-output` }
        ]
      }}
    />
  );
};
