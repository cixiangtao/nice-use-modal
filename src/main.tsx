import ReactDOM from "react-dom/client";

import { ModalProvider } from "../packages/useModal/index.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
