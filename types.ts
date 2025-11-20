export interface ColoringPage {
  id: number;
  description: string;
  imageUrl?: string; // Base64 data URL
  status: 'pending' | 'generating' | 'complete' | 'error';
}

export interface BookState {
  theme: string;
  childName: string;
  status: 'idle' | 'planning' | 'generating' | 'ready' | 'error';
  pages: ColoringPage[];
  cover: ColoringPage;
  error?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// jsPDF type definition shim for the global variable
declare global {
  interface Window {
    jspdf: {
      jsPDF: new (options?: any) => any;
    };
  }
}