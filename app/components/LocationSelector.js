"use client";
import { useEffect, useState, useCallback } from "react";
import { Country, State, City } from "country-state-city";
import FormDropdown from "./FormDropdown";

export default function LocationSelector({
  onLocationChange,
  initialData = {},
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    initialData.country || ""
  );
  const [selectedState, setSelectedState] = useState(initialData.state || "");
  const [selectedCity, setSelectedCity] = useState(initialData.city || "");

  // Load Countries
  useEffect(() => {
    try {
      const allCountries = Country.getAllCountries();
      setCountries(
        allCountries.map((country) => ({
          label: country.name,
          value: country.name,
          isoCode: country.isoCode,
        }))
      );
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  }, []);

  // Load States
  useEffect(() => {
    try {
      if (selectedCountry) {
        const countryObj = countries.find((c) => c.label === selectedCountry);
        if (countryObj) {
          const statesData = State.getStatesOfCountry(countryObj.isoCode);
          setStates(
            statesData.map((state) => ({
              label: state.name,
              value: state.isoCode,
              name: state.name,
            }))
          );
        }
      } else {
        setStates([]);
        setSelectedState("");
      }
    } catch (error) {
      console.error("Error loading states:", error);
      setStates([]);
    }
  }, [selectedCountry, countries]);

  // Load Cities
  useEffect(() => {
    try {
      if (selectedCountry && selectedState) {
        const countryObj = countries.find((c) => c.label === selectedCountry);
        const stateObj = states.find((s) => s.value === selectedState);

        if (countryObj && stateObj) {
          const citiesData = City.getCitiesOfState(
            countryObj.isoCode,
            stateObj.value
          );
          setCities(
            citiesData.map((city) => ({
              label: city.name,
              value: city.name,
            }))
          );
        }
      } else {
        setCities([]);
        setSelectedCity("");
      }
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
    }
  }, [selectedCountry, selectedState, countries, states]);

  // Memoized callback to prevent infinite re-renders
  const handleLocationUpdate = useCallback(() => {
    onLocationChange({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    });
  }, [selectedCountry, selectedState, selectedCity]);

  // Call only when values actually change
  useEffect(() => {
    handleLocationUpdate();
  }, [handleLocationUpdate]);

  return (
    <div className="space-y-5">
      {/* Country Dropdown */}
      <FormDropdown
        label="Country"
        name="country"
        options={[{ label: "Select Country", value: "" }, ...countries]}
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedState("");
          setSelectedCity("");
        }}
      />

      {/* State/Province Dropdown */}
      <FormDropdown
        label="State / Province"
        name="state"
        options={[
          { label: "Select State", value: "" },
          ...states.map((state) => ({ label: state.name, value: state.value })),
        ]}
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
      />

      {/* City Dropdown */}
      <FormDropdown
        label="City"
        name="city"
        options={[{ label: "Select City", value: "" }, ...cities]}
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------

// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { Country, State, City } from "country-state-city";
// import SearchOnlyDropdown from "./SearchOnlyDropdown";

// export default function LocationSelector({
//   onLocationChange,
//   initialData = {},
// }) {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(
//     initialData.country || ""
//   );
//   const [selectedState, setSelectedState] = useState(initialData.state || "");
//   const [selectedCity, setSelectedCity] = useState(initialData.city || "");

//   // Load Countries
//   useEffect(() => {
//     try {
//       const allCountries = Country.getAllCountries();
//       setCountries(
//         allCountries.map((country) => ({
//           label: country.name,
//           value: country.name,
//           isoCode: country.isoCode,
//         }))
//       );
//     } catch (error) {
//       console.error("Error loading countries:", error);
//     }
//   }, []);

//   // Load States
//   useEffect(() => {
//     try {
//       if (selectedCountry) {
//         const countryObj = countries.find((c) => c.label === selectedCountry);
//         if (countryObj) {
//           const statesData = State.getStatesOfCountry(countryObj.isoCode);
//           setStates(
//             statesData.map((state) => ({
//               label: state.name,
//               value: state.isoCode,
//               name: state.name,
//             }))
//           );
//         }
//       } else {
//         setStates([]);
//         setSelectedState("");
//       }
//     } catch (error) {
//       console.error("Error loading states:", error);
//       setStates([]);
//     }
//   }, [selectedCountry, countries]);

//   // Load Cities
//   useEffect(() => {
//     try {
//       if (selectedCountry && selectedState) {
//         const countryObj = countries.find((c) => c.label === selectedCountry);
//         const stateObj = states.find((s) => s.value === selectedState);

//         if (countryObj && stateObj) {
//           const citiesData = City.getCitiesOfState(
//             countryObj.isoCode,
//             stateObj.value
//           );
//           setCities(
//             citiesData.map((city) => ({
//               label: city.name,
//               value: city.name,
//             }))
//           );
//         }
//       } else {
//         setCities([]);
//         setSelectedCity("");
//       }
//     } catch (error) {
//       console.error("Error loading cities:", error);
//       setCities([]);
//     }
//   }, [selectedCountry, selectedState, countries, states]);

//   // Memoized callback to prevent infinite re-renders
//   const handleLocationUpdate = useCallback(() => {
//     onLocationChange({
//       country: selectedCountry,
//       state: selectedState,
//       city: selectedCity,
//     });
//   }, [selectedCountry, selectedState, selectedCity, onLocationChange]);

//   // Call only when values actually change
//   useEffect(() => {
//     handleLocationUpdate();
//   }, [handleLocationUpdate]);

//   return (
//     <div className="space-y-5">
//       {/* Country Dropdown */}
//       <SearchOnlyDropdown
//         label="Country"
//         value={selectedCountry}
//         onChange={(value) => {
//           setSelectedCountry(value);
//           setSelectedState("");
//           setSelectedCity("");
//         }}
//         options={countries.map((c) => c.label)}
//         placeholder="Search country..."
//       />

//       {/* State/Province Dropdown */}
//       <SearchOnlyDropdown
//         label="State / Province"
//         value={
//           selectedState
//             ? states.find((s) => s.value === selectedState)?.name || ""
//             : ""
//         }
//         onChange={(value) => {
//           const stateObj = states.find((s) => s.name === value);
//           setSelectedState(stateObj ? stateObj.value : "");
//           setSelectedCity("");
//         }}
//         options={states.map((s) => s.name)}
//         placeholder="Search state..."
//       />

//       {/* City Dropdown */}
//       <SearchOnlyDropdown
//         label="City"
//         value={selectedCity}
//         onChange={(value) => setSelectedCity(value)}
//         options={cities.map((c) => c.label)}
//         placeholder="Search city..."
//       />
//     </div>
//   );
// }
