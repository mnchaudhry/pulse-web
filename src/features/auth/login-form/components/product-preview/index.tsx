// Floating glass product preview inside the login brand panel.
export const ProductPreview = () => {
  return (
    <div className="max-w-[360px] rounded-[18px] border border-white/[.22] bg-white/[.12] p-[20px_22px] shadow-[0_24px_60px_rgba(0,40,80,.35)] backdrop-blur-[10px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11.5px] text-white/70">Today · Combined</span>
        <span className="flex items-center gap-1.5 text-[10.5px] text-white/[.85]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ff0dd] shadow-[0_0_8px_#7ff0dd] [animation:pulsedot_1.8s_ease-in-out_infinite]" />
          tracking
        </span>
      </div>
      <div className="mono mb-3.5 text-[30px] font-bold tracking-[-1px]">2h 08m</div>
      <div className="mb-4 flex h-2 gap-0.5 overflow-hidden rounded-[5px]">
        <div className="w-[42%] bg-[#bfe3ff]" />
        <div className="w-[26%] bg-[#8fd8de]" />
        <div className="w-[18%] bg-[#c9b6e6]" />
        <div className="w-[14%] bg-[#f0cfa0]" />
      </div>
      <div className="flex flex-col gap-2.5">
        {[
          { name: 'Dev', dur: '54m', color: '#bfe3ff' },
          { name: 'Work', dur: '33m', color: '#8fd8de' },
          { name: 'Social', dur: '23m', color: '#c9b6e6' },
        ].map(row => (
          <div key={row.name} className="flex items-center gap-[9px] text-[12.5px] text-white/90">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: row.color }} />
            <span className="flex-1">{row.name}</span>
            <span className="mono">{row.dur}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
