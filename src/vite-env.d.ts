/// <reference types="vite/client" />

declare namespace chrome {
  namespace runtime {
    function getURL(path: string): string;
  }
}
