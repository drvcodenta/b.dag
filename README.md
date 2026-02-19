To run the project frontend:
- cd /frontend/
- npm i && npm start

backend:
- cd /backend/
- pip install -r requirements.txt
- uvicorn main:app --reload

These are non-negotiable truths for the whole system.

Every node has:

- a stable unique id
- a type
- zero or more input handles
- zero or more output handles

Every edge:

- connects output → input only
- references nodes by id
- cannot be dangling

The pipeline:

- is pure JSON (serializable)
- represents a directed graph
- may be invalid, but invalidity must be detectable