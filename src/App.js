import {AddTask} from './components/AddTask'
import {QueryClient, QueryClientProvider} from "react-query";
import {TasksList} from "./components/TasksList";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <AddTask/>
                <TasksList/>
            </div>
        </QueryClientProvider>
    );
}

export default App;