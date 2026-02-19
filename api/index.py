from http.server import BaseHTTPRequestHandler
import json
from typing import List, Dict, Any

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'Ping': 'Pong'}).encode())
        return

    def do_POST(self):
        # Check if the path is /pipelines/parse or /api/pipelines/parse
        if not (self.path.endswith('/pipelines/parse') or '/pipelines/parse' in self.path):
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not Found'}).encode())
            return
            
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            pipeline = json.loads(post_data)
            nodes = pipeline.get('nodes', [])
            edges = pipeline.get('edges', [])
            
            num_nodes = len(nodes)
            num_edges = len(edges)
            is_dag = check_dag(nodes, edges)
            
            result = {
                'num_nodes': num_nodes,
                'num_edges': num_edges,
                'is_dag': is_dag
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_result = {
                'num_nodes': 0,
                'num_edges': 0,
                'is_dag': False,
                'error': str(e)
            }
            self.wfile.write(json.dumps(error_result).encode())
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return

def check_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    if not nodes:
        return True
    
    if not edges:
        return True
    
    try:
        graph = {node['id']: [] for node in nodes}
        
        for edge in edges:
            source = edge.get('source')
            target = edge.get('target')
            
            if not source or not target:
                return False
            
            if source not in graph or target not in graph:
                return False
            
            graph[source].append(target)
        
        WHITE = 0
        GRAY = 1
        BLACK = 2
        
        color = {node_id: WHITE for node_id in graph}
        
        def has_cycle(node):
            color[node] = GRAY
            
            for neighbor in graph[node]:
                if color[neighbor] == GRAY:
                    return True
                if color[neighbor] == WHITE and has_cycle(neighbor):
                    return True
            
            color[node] = BLACK
            return False
        
        for node_id in graph:
            if color[node_id] == WHITE:
                if has_cycle(node_id):
                    return False
        
        return True
        
    except Exception:
        return False
