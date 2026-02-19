from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from mangum import Mangum

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handler for Vercel serverless
handler = Mangum(app)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/api/pipelines/parse')
def parse_pipeline(pipeline: Dict[str, Any]):
    """
    Backend validates raw pipeline structure
    Enforces invariants:
    - Count nodes
    - Count edges  
    - Check DAG (Directed Acyclic Graph)
    
    Returns deterministic output - no partial success
    """
    try:
        nodes = pipeline.get('nodes', [])
        edges = pipeline.get('edges', [])
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Check if pipeline is a DAG
        # If structure is invalid, returns False
        is_dag = check_dag(nodes, edges)
        
        # Deterministic output - always these three fields
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag
        }
    except Exception as e:
        # Invalid structure → is_dag: false
        # No partial success
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False
        }

def check_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph using DFS
    
    Algorithm:
    1. Build adjacency list from edges using node IDs
    2. Run DFS with cycle detection (using recursion stack)
    3. Return True only if no cycles found
    
    Returns:
        True if graph is a DAG (no cycles)
        False if cycles exist or structure is invalid
    """
    # Empty graph is a DAG
    if not nodes:
        return True
    
    # No edges means disconnected nodes, still a DAG
    if not edges:
        return True
    
    try:
        # Build adjacency list using node IDs
        graph = {node['id']: [] for node in nodes}
        
        for edge in edges:
            source = edge.get('source')
            target = edge.get('target')
            
            # Invalid edge structure
            if not source or not target:
                return False
            
            # Edge references non-existent node
            if source not in graph or target not in graph:
                return False
            
            graph[source].append(target)
        
        # Track visited nodes and current recursion stack
        WHITE = 0  # unvisited
        GRAY = 1   # currently visiting (in recursion stack)
        BLACK = 2  # completely visited
        
        color = {node['id']: WHITE for node in nodes}
        
        def has_cycle_from(node_id: str) -> bool:
            """DFS to detect cycle starting from node_id"""
            color[node_id] = GRAY  # Mark as currently visiting
            
            for neighbor in graph.get(node_id, []):
                if color[neighbor] == GRAY:
                    # Back edge to a node in current path - cycle found!
                    return True
                if color[neighbor] == WHITE:
                    if has_cycle_from(neighbor):
                        return True
            
            color[node_id] = BLACK  # Mark as completely visited
            return False
        
        # Check all components for cycles
        for node in nodes:
            node_id = node.get('id')
            if not node_id:
                return False
            
            if color[node_id] == WHITE:
                if has_cycle_from(node_id):
                    # Cycle detected - NOT a DAG
                    return False
        
        # No cycles found - it's a DAG
        return True
        
    except (KeyError, TypeError, AttributeError) as e:
        # Invalid structure → not a DAG
        print(f"Error checking DAG: {e}")
        return False
