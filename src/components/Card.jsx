export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}
