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

/**
 * Expanded mock restaurants array. Now includes price and rating fields, and more varied data.
 */
const MOCK_RESTAURANTS = [
  {
    name: "Random Bistro",
    address: "123 Foodie Lane, GoodEats City",
    description: "Cozy continental place, great brunch.",
    cuisine: "International, Bistro",
    price: "$$",
    rating: 4.1,
    lat: 37.7749,
    lng: -122.4194
  },
  {
    name: "Noodle Nirvana",
    address: "456 Noodle Rd, Woktown",
    description: "Asian noodles & more, specialty ramen bowls.",
    cuisine: "Asian, Japanese",
    price: "$",
    rating: 4.4,
    lat: 34.0522,
    lng: -118.2437
  },
  {
    name: "Pizza Palace",
    address: "789 Slice Ave, Cheeseborough",
    description: "NY-style pizza, family friendly spot.",
    cuisine: "Pizza, Italian",
    price: "$$",
    rating: 4.0,
    lat: 40.7128,
    lng: -74.0060
  },
  {
    name: "Taco Tower",
    address: "321 Fiesta Blvd, Mexicana",
    description: "Bold flavors, classic tacos & spicy salsas.",
    cuisine: "Mexican, Latin",
    price: "$",
    rating: 4.2,
    lat: 29.4241,
    lng: -98.4936
  },
  {
    name: "Veggie Vibe",
    address: "9 Leafy Green Dr, Plantearth",
    description: "Plant-based, creative vegetarian eats.",
    cuisine: "Vegetarian, Vegan, Healthy",
    price: "$$",
    rating: 4.6,
    lat: 47.6062,
    lng: -122.3321
  },
  {
    name: "Steak Supreme",
    address: "111 Carnivore Ct, Grillville",
    description: "Classic American steakhouse with premium cuts.",
    cuisine: "Steakhouse, American",
    price: "$$$",
    rating: 4.7,
    lat: 41.8781,
    lng: -87.6298
  },
  {
    name: "Curry Corner",
    address: "555 Spice St, Flavor Town",
    description: "Authentic Indian curries and vegetarian dishes.",
    cuisine: "Indian, Vegetarian",
    price: "$$",
    rating: 4.3,
    lat: 39.9526,
    lng: -75.1652
  },
  {
    name: "Burger Base",
    address: "888 Grill Rd, Burger City",
    description: "Classic/creative burgers, fries, shakes.",
    cuisine: "Burger, American, Fast Food",
    price: "$",
    rating: 3.9,
    lat: 42.3601,
    lng: -71.0589
  },
  {
    name: "Sushi Sensei",
    address: "321 Ocean Dr, Sushiville",
    description: "Fresh sushi, sashimi, omakase.",
    cuisine: "Japanese, Sushi",
    price: "$$$",
    rating: 4.8,
    lat: 34.0007,
    lng: -81.0348
  },
  {
    name: "Pho Paradise",
    address: "777 Broth Ave, Little Saigon",
    description: "Vietnamese pho, banh mi, street eats.",
    cuisine: "Vietnamese, Asian",
    price: "$",
    rating: 4.5,
    lat: 29.7604,
    lng: -95.3698
  }
];
// Additional restaurants can be added in real datasets.

/**
 * MainContainer now supports multiple advanced filters:
 * - Text filter for name/address/cuisine
 * - Cuisine dropdown
 * - Price dropdown
 * - Minimum rating selector
 */

function MainContainer() {
  // 1. State for all filter fields
  const [textFilter, setTextFilter] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [minRating, setMinRating] = useState("");

  // 2. State for current suggested restaurant
  const [suggestion, setSuggestion] = useState(null);

  // 3. Cuisine options, dynamically determined from restaurant data
  const cuisineOptions = useMemo(() => {
    const cuisines = new Set();
    MOCK_RESTAURANTS.forEach(r => {
      r.cuisine.split(",").forEach(item => {
        const c = item.trim();
        if (c) cuisines.add(c);
      });
    });
    return Array.from(cuisines).sort();
  }, []);

  // 4. Filtered restaurants according to all filters (multi-criteria)
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      // Text filter (searches name, cuisine, address)
      const lowerText = textFilter.toLowerCase();
      const textMatch =
        !lowerText ||
        r.name.toLowerCase().includes(lowerText) ||
        r.cuisine.toLowerCase().includes(lowerText) ||
        r.address.toLowerCase().includes(lowerText);

      // Cuisine filter (single selection)
      const cuisineMatch =
        !cuisineFilter ||
        r.cuisine.split(",").map(s => s.trim()).includes(cuisineFilter);

      // Price filter ("$", "$$", "$$$")
      const priceMatch = !priceFilter || r.price === priceFilter;

      // Minimum rating (filter as float)
      const ratingMatch =
        !minRating ||
        (typeof r.rating === "number" && r.rating >= parseFloat(minRating));

      // Only include if all criteria are met
      return textMatch && cuisineMatch && priceMatch && ratingMatch;
    });
  }, [textFilter, cuisineFilter, priceFilter, minRating]);

  // 5. Random suggestion picker, avoiding current suggestion if possible
  const getRandomSuggestion = useCallback(() => {
    if (filteredRestaurants.length === 0) return null;
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
    // Otherwise pick any from the filtered list
    const rn = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];
    return rn;
  }, [filteredRestaurants, suggestion]);

  // 6. Set suggestion on any filter changes (if current suggestion doesn't match filters)
  React.useEffect(() => {
    if (!suggestion || !filteredRestaurants.some(r => r.name === suggestion.name)) {
      setSuggestion(getRandomSuggestion());
    }
    // eslint-disable-next-line
  }, [textFilter, cuisineFilter, priceFilter, minRating, filteredRestaurants]);

  // 7. Handlers for UI filter inputs
  const handleTextChange = (e) => setTextFilter(e.target.value);
  const handleCuisineChange = (e) => setCuisineFilter(e.target.value);
  const handlePriceChange = (e) => setPriceFilter(e.target.value);
  const handleRatingChange = (e) => setMinRating(e.target.value);

  // 8. Handler for Re-roll
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
      {/* === Multi-criteria Filter UI === */}
      <section
        style={{
          padding: '32px 0 16px 0',
          background: 'var(--base-dark)',
          borderBottom: '1px solid var(--border-color)'
        }}
        aria-label="Filters and search controls"
      >
        <div className="container" style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          gap: 16
        }}>
          <h2 style={{margin: 0, fontWeight: 600, fontSize: '1.5rem'}}>Find a Place to Eat</h2>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%"
            }}
          >
            <input
              type="text"
              value={textFilter}
              onChange={handleTextChange}
              placeholder="Filter by name, location, or cuisine…"
              style={{
                padding: '10px 11px',
                fontSize: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                minWidth: 170,
                maxWidth: 200,
                background: '#1a1a1a',
                color: 'var(--text-color)'
              }}
              aria-label="General text filter"
              autoFocus
            />
            <select
              value={cuisineFilter}
              onChange={handleCuisineChange}
              style={{
                padding: '10px 7px',
                border: '1px solid var(--border-color)',
                borderRadius: 4,
                background: '#1a1a1a',
                color: 'var(--text-color)',
                fontSize: '1rem',
                minWidth: 110,
                maxWidth: 150
              }}
              aria-label="Cuisine filter"
            >
              <option value="">All cuisines</option>
              {cuisineOptions.map((c) =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
            <select
              value={priceFilter}
              onChange={handlePriceChange}
              style={{
                padding: '10px 7px',
                border: '1px solid var(--border-color)',
                borderRadius: 4,
                background: '#1a1a1a',
                color: 'var(--text-color)',
                fontSize: '1rem',
                minWidth: 90
              }}
              aria-label="Price filter"
            >
              <option value="">All prices</option>
              <option value="$">$ (Cheap)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Expensive)</option>
            </select>
            <select
              value={minRating}
              onChange={handleRatingChange}
              style={{
                padding: '10px 7px',
                border: '1px solid var(--border-color)',
                borderRadius: 4,
                background: '#1a1a1a',
                color: 'var(--text-color)',
                fontSize: '1rem',
                minWidth: 120
              }}
              aria-label="Minimum rating filter"
            >
              <option value="">All ratings</option>
              <option value="4.5">4.5★ and up</option>
              <option value="4.0">4.0★ and up</option>
              <option value="3.5">3.5★ and up</option>
              <option value="3.0">3.0★ and up</option>
            </select>
          </div>
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
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                marginBottom: 10
              }}>
                {suggestion.address}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 10}}>
                {suggestion.price && (
                  <span style={{
                    color: "#E87A41", // price color highlight
                    fontSize: "1.13rem",
                  }}>{suggestion.price}</span>
                )}
                {typeof suggestion.rating === "number" && (
                  <span style={{
                    color: "#FFC107",
                    fontWeight: 500,
                    fontSize: "1.13rem"
                  }}>
                    {suggestion.rating.toFixed(1)}★
                  </span>
                )}
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
// (no code change, file operation to synchronize and trigger analysis/fixes)
