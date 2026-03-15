"use client"

import { useState } from "react"

export default function LocationGate({onLocation}:any){

const [city,setCity]=useState("")

function getLocation(){

navigator.geolocation.getCurrentPosition(

pos=>{

localStorage.setItem(
"prayerLocation",
JSON.stringify({
lat:pos.coords.latitude,
lon:pos.coords.longitude
})
)

onLocation(pos.coords.latitude,pos.coords.longitude)

}

)

}

async function search(){

const res=await fetch(
`https://nominatim.openstreetmap.org/search?format=json&q=${city}`
)

const data=await res.json()

if(data[0]){

onLocation(data[0].lat,data[0].lon)

}

}

return(

<div className="max-w-lg mx-auto text-center py-24 space-y-6">

<h2 className="text-2xl font-bold">
حدد موقعك لمعرفة مواقيت الصلاة
</h2>

<button
onClick={getLocation}
className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
>
استخدام موقعي
</button>

<div className="flex gap-2 justify-center">

<input
value={city}
onChange={e=>setCity(e.target.value)}
className="border px-4 py-2 rounded-xl"
placeholder="مدينة"
/>

<button
onClick={search}
className="px-4 py-2 border rounded-xl"
>
بحث
</button>

</div>

</div>

)

}