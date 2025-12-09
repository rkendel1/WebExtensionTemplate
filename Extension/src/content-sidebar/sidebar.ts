import Sidebar from './Sidebar.svelte';

let app: Sidebar | null = null;
let sidebarContainer: HTMLDivElement | null = null;

function ensureSidebarInitialized() {
  if (sidebarContainer) return;

  sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'ghostpost-sidebar-root';
  document.body.appendChild(sidebarContainer);

  app = new Sidebar({
    target: sidebarContainer,
    props: {
      isVisible: false,
      detectedText: ''
    }
  });
}

export function updateSidebar(isVisible: boolean, detectedText: string) {
  ensureSidebarInitialized();
  
  if (app) {
    app.$set({ isVisible, detectedText });
  }
}

export function toggleSidebar(isVisible: boolean) {
  ensureSidebarInitialized();
  
  if (app) {
    app.$set({ isVisible });
  }
}