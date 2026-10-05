"use client";

export default function ErrorPage({ reset }) {
  return <main className="state-screen" role="alert"><h1>Page unavailable</h1><p>We could not load this page.</p><button onClick={reset}>Try again</button></main>;
}
