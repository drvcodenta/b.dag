# ai agent guidance

rules for any ai assistant working on this codebase.

## system boundaries

- the frontend owns pipeline state (nodes, edges, positions, field values)
- the backend only validates — it receives the pipeline and returns a result
- never duplicate validation logic on the frontend
- never add persistence, caching, or session management unless explicitly asked

## code style

- keep files small and single-purpose
- no abstraction without a second use case — don't create utils/helpers "just in case"
- prefer explicit over clever — a 20-line function is better than a 5-line one that's hard to read
- no retry logic, no optimistic updates, no loading skeletons — show real state only

## node types

- every node must use `BaseNode.js` for rendering — never build a standalone node component
- a new node type = one file in `nodes/`, one entry in `ui.js` nodeTypes, one `DraggableNode` in `toolbar.js`
- nodes define their handles declaratively via a `handles` array passed to `BaseNode`
- don't modify the store or backend to support a new node type

## api contract

- `POST /api/pipelines/parse` always returns exactly: `{ num_nodes, num_edges, is_dag }`
- on error, return the same shape with `is_dag: false` and zeroed counts
- never return partial results or additional fields without explicit approval
- never add new endpoints without explicit approval

## dag validation

- use 3-color dfs (white/gray/black) for cycle detection — don't switch algorithms
- validate edge structure before running dfs (reject missing source/target, dangling refs)
- empty graph = valid dag, no edges = valid dag
- any structural error = `is_dag: false`, never throw to the caller

## testing changes

- after any change, verify: empty pipeline submits correctly, simple chain is a dag, cycle is detected
- if modifying a node type, verify it renders, connects, and deletes without orphaned edges

## things not to do

- don't add typescript — the project is intentionally javascript
- don't add a component library (material ui, chakra, etc.)
- don't add routing — it's a single-page app
- don't add environment-specific logic beyond what `.env.development` and `.env.production` already handle
- don't refactor the dialog component into a shared file unless explicitly asked
