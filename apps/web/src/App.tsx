import { Navigate, Route, Routes } from "react-router-dom";
import { WorkspaceShell } from "./components/workspace-shell";
import { createDataSources } from "./data/create-data-sources";

const dataSources = createDataSources();

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/messages" replace />} />
      <Route path="/messages" element={<WorkspaceShell dataSources={dataSources} />} />
      <Route path="/messages/:conversationId" element={<WorkspaceShell dataSources={dataSources} />} />
      <Route path="/contacts" element={<WorkspaceShell dataSources={dataSources} section="contacts" />} />
      <Route path="/calls" element={<WorkspaceShell dataSources={dataSources} section="calls" />} />
      <Route path="/settings" element={<WorkspaceShell dataSources={dataSources} section="settings" />} />
      <Route path="*" element={<Navigate to="/messages" replace />} />
    </Routes>
  );
}
