# dag pipeline builder

a visual pipeline builder where you drag nodes, connect them, and the backend tells you if it's a valid dag. built with react + reactflow on the frontend and python on the backend, deployed as a single vercel project.

## how to run locally

**frontend:**
```bash
cd frontend
npm install && npm start
```

**backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## project structure

```
├── frontend/           # react app (create-react-app + reactflow + zustand)
│   └── src/
│       ├── nodes/      # 9 node types, all built on BaseNode.js
│       ├── store.js    # zustand store - single source of truth for pipeline state
│       ├── toolbar.js  # draggable node palette + submit button
│       ├── ui.js       # reactflow canvas with drag-and-drop
│       └── submit.js   # submit button component
├── api/                # vercel serverless function (python)
│   └── index.py        # dag validation endpoint
├── backend/            # local dev server (fastapi)
│   └── main.py         # same dag logic, used during development
└── vercel.json         # single deployment config for both frontend + api
```

## key technical decisions

### structure
clear separation — frontend owns all pipeline state (nodes, edges, layout), backend only validates. the `api/` folder is the production serverless function, `backend/` is the local dev equivalent. node components follow a composition pattern: every node passes its config into `BaseNode.js`, which handles handles, styling, and delete behavior. no node reimplements what the base already does.

### simplicity
kept things intentionally small. the store is one zustand file with obvious actions (`addNode`, `deleteNode`, `onConnect`). the dag check is a single function using textbook 3-color dfs. no abstractions beyond what's needed — no custom hooks library, no state machine framework, no validation middleware on the frontend.

### correctness
the backend enforces correctness, not the frontend. `check_dag()` validates that every edge references existing nodes, rejects dangling/missing source-target pairs, and uses 3-color dfs (white/gray/black) for cycle detection. if anything is structurally wrong, `is_dag` returns `false` — there's no partial success or "mostly valid" state. the response is always the same three fields: `num_nodes`, `num_edges`, `is_dag`.

### interface safety
the api validates edge structure (`source`/`target` existence), catches all exceptions, and always returns structured json — never crashes silently. on the frontend, the text node parses `{{variable}}` patterns with regex and generates handles deterministically from the parsed result, so handles can't get out of sync with the text content. the store's `deleteNode` also cleans up connected edges, preventing dangling references.

### change resilience
adding a new node type means creating one file in `nodes/`, registering it in `ui.js`'s `nodeTypes` map and `toolbar.js`'s draggable list. nothing else changes — not the store, not the api, not the dag validation. the backend doesn't care about node types at all; it only sees ids and edges.

### verification
the backend returns a deterministic, structured response (`num_nodes`, `num_edges`, `is_dag`) that's trivially testable — you can write unit tests against `check_dag()` with any graph shape. the frontend shows a dialog with the exact backend response, so what the user sees is what the server returned, no transformation.

### observability
errors don't disappear. the api returns json error responses with an `error` field on failure. the frontend catches fetch errors and shows them in an alert. the backend's try/catch ensures a malformed pipeline always returns `is_dag: false` with zeroed counts rather than a 500.

### communication — tradeoffs and known weaknesses
- **no frontend validation**: the frontend doesn't check for cycles itself. that's intentional — the backend is the single authority on graph validity, which avoids the problem of frontend and backend disagreeing.
- **no persistence**: pipeline state lives in memory only. closing the tab loses everything. adding persistence would mean serializing the zustand store to localstorage or a database, which is straightforward but wasn't the goal here.
- **cors is wide open**: `allow_origins=["*"]` in the backend. fine for a demo, not for production.
- **text node handle positioning**: handles are spaced evenly based on variable count, which can look cramped with many variables. a smarter layout algorithm would help but adds complexity.
- **duplicate dialog component**: the `Dialog` component exists in both `toolbar.js` and `submit.js` — should be extracted into a shared component.

## invariants

these are non-negotiable truths for the whole system.

every node has:
- a stable unique id
- a type
- zero or more input handles
- zero or more output handles

every edge:
- connects output → input only
- references nodes by id
- cannot be dangling

the pipeline:
- is pure json (serializable)
- represents a directed graph
- may be invalid, but invalidity must be detectable

## deployment

deployed as a single vercel project. `vercel.json` builds the react frontend and rewrites `/api/*` routes to the python serverless function in `api/index.py`. no separate deployments needed.

```bash
vercel          # preview deployment
vercel --prod   # production deployment
```