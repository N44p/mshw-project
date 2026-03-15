export async function fetchPrayerTimes(lat:number,lon:number){

const geo=await fetch(
`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar`
)

const geoData=await geo.json()

const city=
geoData.address.city||
geoData.address.town||
geoData.address.village||
geoData.address.state

const res=await fetch(
`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`
)

const data=await res.json()

return{
city,
times:data.data.timings
}

}

export function calculateNextPrayer(times:any){

const now=new Date()

const list=[
{name:"الفجر",time:times.Fajr},
{name:"الظهر",time:times.Dhuhr},
{name:"العصر",time:times.Asr},
{name:"المغرب",time:times.Maghrib},
{name:"العشاء",time:times.Isha}
]

for(const p of list){

const [h,m]=p.time.split(":")

const d=new Date()

d.setHours(parseInt(h),parseInt(m),0)

if(d>now) return p

}

return list[0]

}