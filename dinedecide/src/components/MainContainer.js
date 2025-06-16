import React, { useState } from 'react';

/**
 * MainContainer - Main application layout for DineDecide.
 * Features:
 *  - Top input area for cuisine/location filter (placeholder logic)
 *  - Middle restaurant suggestion area with a 'Re-roll' button
 *  - Map display section for restaurant location (placeholder logic)
 *  - Footer with privacy notice
 */
// PUBLIC_INTERFACE
function MainContainer() {
  // State for filter text input
  const [filter, setFilter] = useState("");
  // State for the current restaurant suggestion (simple placeholder)
  const [suggestion, setSuggestion] = useState({
    name: "Random Bistro",
    address: "123 Foodie Lane, GoodEats City",
    // Placeholder coordinates
    lat: 37.7749,
    lng: -122.4194
  });

  // Placeholder: List of restaurants (static for now for re-rolling)
  const sampleRestaurants = [
    {
      name: "Random Bistro",
      address: "123 Foodie Lane, GoodEats City",
      lat: 37.7749, lng: -122.4194
    },
    {
      name: "Noodle Nirvana",
      address: "456 Noodle Rd, Woktown",
      lat: 34.0522, lng: -118.2437
    },
    {
      name: "Pizza Palace",
      address: "789 Slice Ave, Cheeseborough",
      lat: 40.7128, lng: -74.0060
    }
  ];

  // Handler for 'Re-roll' button
  const handleReroll = () => {
    // Select a random restaurant from sampleRestaurants
    const r = sampleRestaurants[Math.floor(Math.random() * sampleRestaurants.length)];
    setSuggestion(r);
  };

  // Handler for input change (filter text)
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Placeholder: Filtering logic would go here
  };

  // Placeholder for map embed - use coordinates from suggestion
  const mapSrc = `https://maps.google.com/maps?q=${suggestion.lat},${suggestion.lng}&z=15&output=embed`;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--base-dark)',
      color: 'var(--text-color)'
    }}>

      {/* Input/filter area */}
      <section
        style={{
          padding: '32px 0 16px 0',
          background: 'var(--base-dark)',
          borderBottom: '1px solid var(--border-color)'
        }}
        aria-label="Filters and search controls"
      >
        <div className="container" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <h2 style={{margin: 0, fontWeight: 600, fontSize: '1.5rem'}}>Find a Place to Eat</h2>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by cuisine, location…"
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              fontSize: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '350px',
              background: '#1a1a1a',
              color: 'var(--text-color)'
            }}
            aria-label="Cuisine or location filter"
          />
        </div>
      </section>

      {/* Suggestion section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '36px 16px 0 16px',
          background: 'var(--base-dark)'
        }}
        aria-label="Restaurant suggestion"
      >
        <div
          style={{
            background: '#232323',
            borderRadius: 12,
            padding: '32px 24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            maxWidth: 460,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 28
          }}
        >
          <div style={{fontWeight: 700, fontSize: '2rem', marginBottom: 8}}>
            {suggestion.name}
          </div>
          <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 18}}>
            {suggestion.address}
          </div>
          <button
            className="btn btn-large"
            onClick={handleReroll}
            aria-label="Get another restaurant suggestion"
            style={{marginTop: 10}}
          >
            Re-roll
          </button>
        </div>

        {/* Map section */}
        <section
          style={{
            background: '#161728',
            borderRadius: 10,
            width: '100%',
            maxWidth: 560,
            margin: '0 auto',
            marginBottom: 40,
            minHeight: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
          aria-label="Suggested restaurant location map"
        >
          {/* Accessible title for iframes */}
          <iframe
            title={`Map of ${suggestion.name}`}
            src={mapSrc}
            width="100%"
            height="220"
            style={{border:0}}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>

      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#101828',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          textAlign: 'center',
          padding: '20px 0 18px 0',
          marginTop: 'auto'
        }}
        aria-label="Site footer"
      >
        <span>
          © {new Date().getFullYear()} DineDecide | <a href="/privacy" style={{color: 'var(--base-light)'}}>Privacy Notice</a>
        </span>
      </footer>
    </div>
  );
}

export default MainContainer;
