import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Question Paper Generator
      </footer>
    </div>
  );
}
