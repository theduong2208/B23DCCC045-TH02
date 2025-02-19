declare module Doanso {
  interface GameMessage {
  type: 'success' | 'error' | 'warning';
  title: string;
  description: string;
  icon?: React.ReactNode;
  }
}
