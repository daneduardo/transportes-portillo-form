import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

let loaderPromise;

function getGoogleMaps(apiKey) {
  if (!loaderPromise) {
    loaderPromise = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    }).load();
  }
  return loaderPromise;
}

function getCityState(place) {
  if (!place) return "";
  let city = "";
  let state = "";
  for (const component of place.address_components || []) {
    if (component.types.includes("locality")) city = component.long_name;
    if (component.types.includes("administrative_area_level_1")) {
      state = component.short_name;
    }
  }
  const label = [city, state].filter(Boolean).join(", ");
  return label || place.formatted_address || "";
}

export default function LocationAutocomplete({
  id,
  name,
  value,
  placeholder,
  error,
  onChange,
}) {
  const inputRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    let active = true;
    let autocomplete;

    getGoogleMaps(apiKey)
      .then((google) => {
        if (!active || !inputRef.current) return;
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "mx" },
          fields: ["address_components", "formatted_address"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const next = getCityState(place);
          if (inputRef.current) inputRef.current.value = next;
          onChangeRef.current(next);
        });
      })
      .catch(() => {
        // If the Maps API fails to load, the plain input still works.
      });

    return () => {
      active = false;
      if (autocomplete && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <input
      id={id}
      name={name}
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      ref={inputRef}
      className={`input input-bordered w-full focus:border-brandgreen focus:outline focus:outline-2 focus:outline-brandgreen/40 ${
        error ? "input-error" : ""
      }`}
      value={value}
      onChange={(e) => onChangeRef.current(e.target.value)}
    />
  );
}
