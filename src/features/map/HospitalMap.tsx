import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon } from 'lucide-react';
import type { Hospital } from '../../types/hospital';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? '';
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN;

interface HospitalMapProps {
  hospitals: Hospital[];
  center?: { lat: number; lng: number } | null;
  onSelect?: (hospital: Hospital) => void;
}

export function HospitalMap({ hospitals, center, onSelect }: HospitalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center ? [center.lng, center.lat] : [8.6753, 9.082],
      zoom: center ? 11 : 5,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.on('load', () => setMapLoaded(true));
    return () => {
      map.remove();
      setMapLoaded(false);
    };
  }, []);

  const placeMarkers = useCallback((map: mapboxgl.Map, list: Hospital[]) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    list.forEach((h) => {
      if (h.lat == null || h.lng == null) return;

      const el = document.createElement('div');
      el.style.cssText =
        'width:30px;height:30px;border-radius:5px;background:#00e5d4;border:2px solid rgba(255,255,255,0.15);box-shadow:0 2px 10px rgba(0,229,212,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#000;font-size:13px;font-weight:700;';
      el.textContent = '+';
      el.setAttribute('aria-label', h.name);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="padding:8px 10px;font-size:13px;font-family:Outfit,sans-serif"><strong>${h.name}</strong><br><span style="color:#64748b">${h.city ?? ''}</span></div>`,
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([h.lng, h.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => onSelectRef.current?.(h));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelectRef.current?.(h);
      });

      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !MAPBOX_TOKEN) return;
    placeMarkers(map, hospitals);
  }, [hospitals, mapLoaded, placeMarkers]);

  useEffect(() => {
    if (center && mapRef.current && MAPBOX_TOKEN) {
      mapRef.current.flyTo({ center: [center.lng, center.lat], zoom: 11 });
    }
  }, [center]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[480px] w-full flex-col items-center justify-center gap-3 rounded-[5px] border border-dashed border-line bg-muted">
        <span className="grid size-10 place-items-center rounded-[5px] bg-surface text-soft shadow-sm">
          <MapIcon className="size-5" strokeWidth={1.5} />
        </span>
        <div className="text-center">
          <p className="font-display text-[13px] text-ink">MAP UNAVAILABLE</p>
          <p className="mt-1 text-[12px] text-soft">
            Add your Mapbox token to <code className="rounded-[5px] bg-surface px-1.5 py-0.5 text-accent">.env</code> to enable the map
          </p>
          <p className="mt-0.5 text-[11px] text-soft">
            VITE_MAPBOX_TOKEN=pk.eyJ1IjoiY...
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-[480px] w-full rounded-[5px]" />;
}
