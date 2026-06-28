export default function Button({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }) {
  const baseStyles = "font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#00A859] hover:bg-[#008f4c] text-white py-2 px-4",
    outline: "border border-[#00A859] text-[#00A859] hover:bg-[#f1faf4] py-2 px-4",
    ghost: "text-[#00A859] hover:text-[#008f4c] hover:bg-[#f1faf4] py-2 px-4"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
