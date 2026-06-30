"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, Phone, Mail, Clock, Compass, Search, 
  Map as MapIcon, List, Eye, Navigation, PhoneCall, RefreshCw
} from "lucide-react";
import { subscribeToAshrams } from "../lib/db";

export default function AshramMap({ initialAshrams = [] }) {
  const [ashrams, setAshrams] = useState(initialAshrams);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'list' | 'map'
  const [selectedAshram, setSelectedAshram] = useState(null);
  
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const unsubscribe = subscribeToAshrams((data) => {
      setAshrams(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const centerTypes = ["All", "Temple", "Ashram", "Satsang Center"];

  // Filter ashrams
  const filteredAshrams = ashrams.filter(ash => {
    const matchesSearch = 
      ash.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ash.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ash.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || ash.centerType === selectedType;
    return matchesSearch && matchesType;
  });

  // Dynamically load Leaflet CDN assets and initialize map
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (!mapRef.current) return;
      
      const L = window.L;
      
      // Fix default marker icon path issue in Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Default center in India
      const defaultCenter = [20.5937, 78.9629];
      const defaultZoom = 5;

      const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);

      leafletMapInstance.current = map;
      updateMarkers();
    };

    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, []);

  // Update map markers when filtered list changes
  useEffect(() => {
    updateMarkers();
  }, [filteredAshrams]);

  const updateMarkers = () => {
    const map = leafletMapInstance.current;
    const L = window.L;
    if (!map || !L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    if (filteredAshrams.length === 0) return;

    const bounds = [];
    filteredAshrams.forEach(ash => {
      const lat = parseFloat(ash.latitude);
      const lng = parseFloat(ash.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
              <strong style="color: #6d1b1b; display: block; margin-bottom: 2px;">${ash.name}</strong>
              <span style="color: #832727; font-weight: bold; font-size: 10px;">${ash.centerType}</span>
              <p style="margin: 4px 0 0 0; color: #555; font-size: 11px;">${ash.address}</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="display: inline-block; margin-top: 6px; font-weight: bold; color: #f59e0b; text-decoration: none;">Get Directions &rarr;</a>
            </div>
          `);
        
        markersRef.current.push(marker);
        bounds.push([lat, lng]);
      }
    });

    // Fit map bounds to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  const handleCardClick = (ash) => {
    setSelectedAshram(ash);
    const map = leafletMapInstance.current;
    if (!map) return;

    const lat = parseFloat(ash.latitude);
    const lng = parseFloat(ash.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], 14, { animate: true, duration: 1 });
      
      // Find and trigger popup for this marker
      const L = window.L;
      if (L) {
        markersRef.current.forEach(marker => {
          const mLatLng = marker.getLatLng();
          if (Math.abs(mLatLng.lat - lat) < 0.0001 && Math.abs(mLatLng.lng - lng) < 0.0001) {
            marker.openPopup();
          }
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="bg-white/70 border border-gold/15 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by city, state, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-gold/25 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-saffron text-dark-brown"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-dark-brown/40" />
        </div>

        {/* Center Type Tabs & View Switcher */}
        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end w-full md:w-auto">
          <div className="flex flex-wrap gap-1">
            {centerTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 font-serif border ${
                  selectedType === type
                    ? "bg-maroon text-white border-maroon shadow-sm"
                    : "bg-cream text-dark-brown/70 hover:bg-gold-light/25 border-gold/15"
                }`}
              >
                {type === "All" ? "All Centers" : type}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gold/20 rounded-xl overflow-hidden bg-cream">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 ${viewMode === "split" ? "bg-saffron text-white" : "text-dark-brown/65 hover:bg-gold-light/20"}`}
            >
              <MapIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Split View</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 ${viewMode === "list" ? "bg-saffron text-white" : "text-dark-brown/65 hover:bg-gold-light/20"}`}
            >
              <List className="w-3.5 h-3.5" /> <span className="hidden sm:inline">List Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className={`grid grid-cols-1 ${viewMode === "split" ? "lg:grid-cols-5" : ""} gap-6 min-h-[550px]`}>
        
        {/* Ashrams list */}
        <div className={`${viewMode === "split" ? "lg:col-span-2 max-h-[580px] overflow-y-auto pr-2 space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
          {filteredAshrams.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-3xl border border-gold/15 shadow-sm w-full col-span-full">
              <MapPin className="w-10 h-10 text-gold/30 mx-auto mb-2" />
              <p className="font-serif italic text-dark-brown/65 text-sm">
                No centers found matching search criteria.
              </p>
            </div>
          ) : (
            filteredAshrams.map(ash => (
              <div
                key={ash.id}
                onClick={() => handleCardClick(ash)}
                className={`bg-white/80 border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  selectedAshram?.id === ash.id ? "border-saffron ring-1 ring-saffron" : "border-gold/15"
                }`}
              >
                <div>
                  {ash.imageUrl && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3.5 border border-gold/10">
                      <img src={ash.imageUrl} alt={ash.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <span className="text-[9px] uppercase font-bold text-saffron tracking-wider block mb-1">
                    {ash.centerType}
                  </span>
                  
                  <h3 className="font-serif font-black text-sm text-maroon leading-tight mb-2 group-hover:text-saffron transition-colors">
                    {ash.name}
                  </h3>

                  <p className="text-[11px] text-dark-brown/70 flex items-start gap-1.5 leading-relaxed font-sans mb-3">
                    <MapPin className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
                    {ash.address}
                  </p>

                  <div className="space-y-1 text-[10px] text-dark-brown/60 pt-2 border-t border-gold/10">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-saffron" />
                      {ash.timings}
                    </p>
                    {ash.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-saffron" />
                        {ash.phone}
                      </p>
                    )}
                    {ash.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-saffron" />
                        {ash.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card actions */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gold/10">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${ash.latitude},${ash.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-cream hover:bg-gold-light/25 text-maroon text-[10px] font-bold rounded-lg border border-gold/15 transition-all"
                  >
                    <Navigation className="w-3 h-3" /> Directions
                  </a>
                  {ash.phone && (
                    <a
                      href={`tel:${ash.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-saffron hover:bg-saffron-dark text-white text-[10px] font-bold rounded-lg transition-all"
                    >
                      <PhoneCall className="w-3 h-3" /> Call Center
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map Container */}
        {viewMode === "split" && (
          <div className="lg:col-span-3 h-[500px] lg:h-full min-h-[450px] border border-gold/20 rounded-3xl overflow-hidden shadow-sm relative bg-cream/15">
            <div id="map-container" ref={mapRef} className="w-full h-full z-10" />
            
            {/* Map Loading overlay */}
            <div className="absolute inset-0 bg-cream/80 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 z-20">
              <RefreshCw className="w-6 h-6 text-saffron animate-spin" />
              <span className="text-[10px] font-bold text-dark-brown/65 mt-2 uppercase tracking-widest">
                Updating Map...
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
