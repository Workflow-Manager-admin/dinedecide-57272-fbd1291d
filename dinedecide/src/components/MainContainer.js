import React, { useState, useMemo, useCallback } from 'react';

/**
 * MainContainer - Main application layout for DineDecide.
 * (Enhanced: restaurant suggestion logic, filter logic, reroll, map wiring)
 *
 * Features:
 *  - Input area for cuisine/location filter (filter logic included)
 *  - Restaurant suggestion w/ re-roll linked to user filter/input
 *  - Map display tied to suggested restaurant (mock data/placeholder)
 *  - Clean state management, easy to extend/mockable
 */

// Mock restaurants array (can easily be replaced by backend/API later)
const MOCK_RESTAURANTS = [
  {
    name: "Random Bistro",
    address: "123 Foodie Lane, GoodEats City",
    description: "Cozy continental place, great brunch.",
    cuisine: "International",
    lat: 37.7749, lng: -122.4194
  },
  {
    name: "Noodle Nirvana",
    address: "456 Noodle Rd, Woktown",
    description: "Asian noodles & more, specialty ramen bowls.",
    cuisine: "Asian",
    lat: 34.0522, lng: -118.2437
  },
  {
    name: "Pizza Palace",
    address: "789 Slice Ave, Cheeseborough",
    description: "NY-style pizza, family friendly spot.",
    cuisine: "Pizza Italian",
    lat: 40.7128, lng: -74.0060
  },
  {
    name: "Taco Tower",
    address: "321 Fiesta Blvd, Mexicana",
    description: "Bold flavors, classic tacos & spicy salsas.",
    cuisine: "Mexican",
    lat: 29.4241, lng: -98.4936
  },
  {
    name: "Veggie Vibe",
    address: "9 Leafy Green Dr, Plantearth",
    description: "Plant-based, creative vegetarian eats.",
    cuisine: "Vegetarian Vegan Healthy",
    lat: 47.6062, lng: -122.3321
  }
];

// PUBLIC_INTERFACE
function MainContainer() {
  // 1. State for user filter
  const [filter, setFilter] = useState("");
  // 2. State for current suggested restaurant
  const [suggestion, setSuggestion] = useState(null);

  // 3. Filtered restaurants according to user input (name/cuisine/address, insensitive)
  const filteredRestaurants = useMemo(() => {
    if (!filter) return MOCK_RESTAURANTS;
    const f = filter.toLowerCase();
    return MOCK_RESTAURANTS.filter(
      r =>
        r.name.toLowerCase().includes(f) ||
        r.cuisine.toLowerCase().includes(f) ||
        r.address.toLowerCase().includes(f)
    );
  }, [filter]);

  // 4. Pick random restaurant from filtered list
  const getRandomSuggestion = useCallback(() => {
    if (filteredRestaurants.length === 0) return null;
    // Simple: avoid suggesting the current restaurant, unless there is only one
    if (
      suggestion &&
      filteredRestaurants.length > 1
    ) {
      const withoutCurrent = filteredRestaurants.filter(
        (r) => r.name !== suggestion.name
      );
      const rn = withoutCurrent[Math.floor(Math.random() * withoutCurrent.length)];
      return rn;
    }
    // else: just pick a random
    const rn = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];
    return rn;
  }, [filteredRestaurants, suggestion]);

  // 5. Set suggestion on mount and whenever filter changes (if current suggestion doesn't match filter)
  React.useEffect(() => {
    if (!suggestion || !filteredRestaurants.some(r => r.name === suggestion.name)) {
      setSuggestion(getRandomSuggestion());
    }
    // eslint-disable-next-line
  }, [filter, filteredRestaurants]); // intentionally not on suggestion

  // 6. Handler for user filter input
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Filtering handled via useMemo above, suggestion picked via useEffect
  };

  // 7. Handler for Re-roll
  const handleReroll = () => {
    const next = getRandomSuggestion();
    if (next) setSuggestion(next);
  };

  // 8. Map src for embed (keeps in sync with suggestion)
  const mapSrc = suggestion
    ? `https://maps.google.com/maps?q=${suggestion.lat},${suggestion.lng}&z=15&output=embed`
    : "";

  // 9. Component rendering
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
            placeholder="Filter by cuisine, location, or name…"
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
            autoFocus
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
        {/* SUGGESTION BOX */}
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
          {suggestion ? (
            <>
              <div style={{fontWeight: 700, fontSize: '2rem', marginBottom: 8}}>
                {suggestion.name}
              </div>
              <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 6}}>
                {suggestion.cuisine}
              </div>
              <div style={{color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 10}}>
                {suggestion.address}
              </div>
              {suggestion.description &&
                <div style={{fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: 16, textAlign: 'center'}}>
                  {suggestion.description}
                </div>
              }
              <button
                className="btn btn-large"
                onClick={handleReroll}
                aria-label="Get another restaurant suggestion"
                style={{marginTop: 8}}
                disabled={filteredRestaurants.length < 2}
                title={filteredRestaurants.length < 2 ? "Not enough results to re-roll" : "Re-roll a new suggestion"}
              >
                Re-roll
              </button>
              {filteredRestaurants.length === 0 && (
                <div style={{color: '#e02424', fontSize: '1.03rem', marginTop: 18}}>
                  No restaurants found for your filter.
                </div>
              )}
            </>
          ) : (
            <div style={{color: '#e02424', minHeight: 68}}>
              No suggestion available.
            </div>
          )}
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
          {suggestion && (
            <iframe
              title={`Map of ${suggestion.name}`}
              src={mapSrc}
              width="100%"
              height="220"
              style={{border:0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
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
