"use client"

export default function PrayerCard({name,time}:any){

function format(t:string){

let[h,m]=t.split(":")
let hour=parseInt(h)

const ampm=hour>=12?"م":"ص"

hour=hour%12||12

return `${hour}:${m} ${ampm}`

}

return(

<div className="group relative p-6 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:scale-105 transition-all duration-300 shadow-lg">

<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl"/>

<div className="relative z-10 text-center">

<p className="text-xs uppercase tracking-widest opacity-60 mb-2">
{name}
</p>

<p className="text-2xl font-black">
{format(time)}
</p>

</div>

</div>

)

}