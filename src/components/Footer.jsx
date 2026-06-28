export default function Footer() {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-xs text-slate-500 font-medium">
        &copy; 2023 ADMIN System Ecosystem. <span className="text-slate-400">All rights reserved.</span>
      </p>
      
      <div className="flex items-center gap-6 text-xs text-slate-600 font-bold">
        <a href="#" className="hover:text-[#00A859] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#00A859] transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
}
