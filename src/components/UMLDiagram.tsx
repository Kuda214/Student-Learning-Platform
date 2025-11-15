import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';

export function UMLDiagram() {
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (id) => setHovered(id);
  const handleMouseLeave = () => setHovered(null);

  const isHovered = (id) => hovered === id;

  const boxStyle = (id) => ({
    transform: isHovered(id) ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    opacity: isHovered(id) ? 0.9 : 1,
  });

  return (
    <Card className="shadow-md border-1">
      <CardHeader className="pb-3 bg-white text-black border-b border-gray-200">
        <CardTitle className="text-sm">UML Diagram</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <svg viewBox="0 0 300 200" className="w-full h-auto">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
            </marker>
          </defs>

          {/* Subject Box */}
          <g
            onMouseEnter={() => handleMouseEnter('subject')}
            onMouseLeave={handleMouseLeave}
            style={boxStyle('subject')}
          >
            <rect x="100" y="10" width="100" height="60" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="2" rx="4" />
            <text x="150" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              Subject
            </text>
            <line x1="100" y1="38" x2="200" y2="38" stroke="white" strokeWidth="1" />
            <text x="150" y="50" textAnchor="middle" fill="white" fontSize="9">
              +attach()
            </text>
            <text x="150" y="62" textAnchor="middle" fill="white" fontSize="9">
              +notify()
            </text>
          </g>

          {/* Observer Interface */}
          <g
            onMouseEnter={() => handleMouseEnter('observerInterface')}
            onMouseLeave={handleMouseLeave}
            style={boxStyle('observerInterface')}
          >
            <rect x="100" y="130" width="100" height="50" fill="#f97316" stroke="#f97316" strokeWidth="2" rx="4" />
            <text x="150" y="148" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontStyle="italic">
              «interface»
            </text>
            <text x="150" y="160" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              Observer
            </text>
            <line x1="100" y1="165" x2="200" y2="165" stroke="white" strokeWidth="1" />
            <text x="150" y="176" textAnchor="middle" fill="white" fontSize="9">
              +update()
            </text>
          </g>

          {/* Concrete Observers */}
          <g
            onMouseEnter={() => handleMouseEnter('observerA')}
            onMouseLeave={handleMouseLeave}
            style={boxStyle('observerA')}
          >
            <rect x="10" y="130" width="70" height="40" fill="#64748b" stroke="#64748b" strokeWidth="1.5" rx="3" />
            <text x="45" y="148" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              Observer A
            </text>
            <text x="45" y="162" textAnchor="middle" fill="white" fontSize="8">
              +update()
            </text>
          </g>

          <g
            onMouseEnter={() => handleMouseEnter('observerB')}
            onMouseLeave={handleMouseLeave}
            style={boxStyle('observerB')}
          >
            <rect x="220" y="130" width="70" height="40" fill="#64748b" stroke="#64748b" strokeWidth="1.5" rx="3" />
            <text x="255" y="148" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              Observer B
            </text>
            <text x="255" y="162" textAnchor="middle" fill="white" fontSize="8">
              +update()
            </text>
          </g>

          {/* Lines */}
          <line x1="150" y1="70" x2="150" y2="130" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="160" y="100" fill="#64748b" fontSize="9">
            notifies
          </text>
          <line x1="100" y1="155" x2="80" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="200" y1="155" x2="220" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
        </svg>
      </CardContent>
    </Card>
  );
}
