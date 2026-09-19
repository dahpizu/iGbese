const Logo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      {!compact && (
        <div className="leading-none">
          <div className="text-xl font-extrabold tracking-[-0.04em] text-white">
            iGbese
          </div>

          <div className="mono mt-1 text-[8px] uppercase tracking-[0.28em] text-[#8cff72]/50">
            finance.system
          </div>
        </div>
      )}

      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#8cff72]/30 bg-[#8cff72]/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,255,114,0.18),transparent_65%)]" />

        <span className="relative text-xl">₦</span>
      </div>
    </div>
  );
};

export default Logo;
