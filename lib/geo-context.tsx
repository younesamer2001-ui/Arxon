'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GeoData {
  city: string | null
  country: string | null
  region: string | null
}

interface GeoContextType {
  geo: GeoData
}

const GeoContext = createContext<GeoContextType>({
  geo: { city: null, country: null, region: null },
})

/** Norwegian city names — normalise common Vercel geo values */
const CITY_DISPLAY: Record<string, string> = {
  oslo: 'Oslo',
  bergen: 'Bergen',
  trondheim: 'Trondheim',
  stavanger: 'Stavanger',
  drammen: 'Drammen',
  fredrikstad: 'Fredrikstad',
  kristiansand: 'Kristiansand',
  tromsø: 'Tromsø',
  tromso: 'Tromsø',
  sandnes: 'Sandnes',
  sarpsborg: 'Sarpsborg',
  skien: 'Skien',
  bodø: 'Bodø',
  bodo: 'Bodø',
  ålesund: 'Ålesund',
  alesund: 'Ålesund',
  sandefjord: 'Sandefjord',
  haugesund: 'Haugesund',
  tønsberg: 'Tønsberg',
  tonsberg: 'Tønsberg',
  moss: 'Moss',
  porsgrunn: 'Porsgrunn',
  arendal: 'Arendal',
  hamar: 'Hamar',
  larvik: 'Larvik',
  halden: 'Halden',
  lillehammer: 'Lillehammer',
  molde: 'Molde',
  harstad: 'Harstad',
  gjøvik: 'Gjøvik',
  gjovik: 'Gjøvik',
  kongsberg: 'Kongsberg',
  hønefoss: 'Hønefoss',
  honefoss: 'Hønefoss',
}

function normaliseCityName(raw: string): string {
  const lower = raw.toLowerCase().trim()
  return CITY_DISPLAY[lower] || raw
}

function parseCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoData>({ city: null, country: null, region: null })

  useEffect(() => {
    const city = parseCookie('arxon-geo-city')
    const country = parseCookie('arxon-geo-country')
    const region = parseCookie('arxon-geo-region')
    setGeo({
      city: city ? normaliseCityName(city) : null,
      country: country || null,
      region: region || null,
    })
  }, [])

  return (
    <GeoContext.Provider value={{ geo }}>
      {children}
    </GeoContext.Provider>
  )
}

export function useGeo() {
  return useContext(GeoContext)
}
