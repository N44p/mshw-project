"use client"

export default function NextPrayer({prayer,countdown}:any){

if(!prayer) return null

return(

<div className="relative overflow-hidden rounded-[40px] p-10 md:p-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white shadow-2xl">

<div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]"/>

<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">

<div className="space-y-4 text-center md:text-right">

<p className="uppercase text-xs tracking-widest opacity-80">
الصلاة القادمة
</p>

<h2 className="text-6xl md:text-8xl font-black leading-none">
{prayer.name}
</h2>

<p className="text-xl opacity-90">
{prayer.time}
</p>

</div>

<div className="flex flex-col items-center justify-center w-44 h-44 md:w-60 md:h-60 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">

<p className="text-xs uppercase opacity-70">
متبقي
</p>

<p className="text-4xl md:text-5xl font-mono font-black">
{countdown}
</p>

</div>

</div>

</div>

)

}