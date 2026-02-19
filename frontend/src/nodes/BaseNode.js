// BaseNode.js
// A flexible abstraction for creating nodes with configurable handles, fields, and content

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

/**
 * BaseNode - A reusable node component with unified styling
 * Styling is centralized here to maintain consistency across all node types
 */
export const BaseNode = ({ id, data }) => {
  const { deleteNode } = useStore();
  
  const {
    nodeType = 'Node',
    icon,
    handles = [],
    content: CustomContent,
    customStyle = {},
    onTextChange
  } = data;

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div 
      className="bg-white border border-gray-300 rounded-lg shadow-md p-3 min-w-[200px] relative group"
      style={customStyle}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 bg-[#6467f1] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        title="Delete node"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Render handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${id}-handle-${index}`}
          type={handle.type}
          position={handle.position || (handle.type === 'source' ? Position.Right : Position.Left)}
          id={handle.id || `${id}-${handle.type}-${index}`}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
          style={handle.style || {}}
        />
      ))}

      {/* Node title with optional icon */}
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="font-semibold text-gray-700 text-sm">{nodeType}</span>
      </div>

      {/* Custom content */}
      {CustomContent && <CustomContent id={id} data={data} onTextChange={onTextChange} />}
    </div>
  );
};
