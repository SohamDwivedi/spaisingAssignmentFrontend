declare global {
  interface Window {
    updateCartCount?: () => void;
    showAuthModal?: ()=> void;
  }
}

export {};
