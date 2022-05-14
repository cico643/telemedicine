declare module 'express-session' {
  export interface Session {
    context: {
      id: number;
      email: string;
      type: string;
    };
  }
}

export {};
