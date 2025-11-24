import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-xl text-blue-700">
          QBank Generator
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/generator" className="hover:text-blue-700">
            Generator
          </Link>
          <Link href="/admin/questions" className="hover:text-blue-700">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
