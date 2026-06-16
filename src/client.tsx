import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { createRouter } from "./router";

const router = createRouter();

// @ts-ignore
hydrateRoot(document, <StartClient router={router} />);
