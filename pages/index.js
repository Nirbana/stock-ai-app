import ChatApp from '../components/ChatApp';
import '../styles/globals.css';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        <ChatApp />
      </div>
    </main>
  );
}