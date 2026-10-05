"use client";

export default function MenuError({ reset }) {
  return <main className="state-screen"><h1>Menu unavailable</h1><p>We could not load the menu right now. Visit <code>/menu?fail=menu</code> to test this boundary.</p><button className="primary-button" type="button" onClick={() => reset()}>Try again</button></main>;
}
