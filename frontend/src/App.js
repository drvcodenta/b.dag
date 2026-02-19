import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
