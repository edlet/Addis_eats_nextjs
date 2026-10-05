import Link from "next/link";
import { signInCustomer } from "../actions/auth";
import { getSession, safeNext } from "../lib/session";

export const metadata = { title: "Customer sign in | Addis Eats" };

export default async function SignInPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const next = safeNext(params?.next, "/menu");

  return (
    <main className="account-page">
      <section className="account-card" aria-labelledby="sign-in-title">
        <p className="section-kicker">Welcome to Addis Eats</p>
        <h1 id="sign-in-title">{session ? `You are signed in, ${session.name || "there"}.` : "Customer sign in"}</h1>
        {session ? (
          <>
            <p>Your {process.env.NODE_ENV === "production" ? "guest" : "demo"} session is active. You can place orders and view this session&apos;s order history.</p>
            <Link href={session.role === "staff" ? "/admin" : "/menu"} className="primary-button">{session.role === "staff" ? "Open staff console" : "Browse the menu"}</Link>
          </>
        ) : (
          <>
            <p>Enter your contact details to start a customer session and place an order.</p>
            {params?.auth === "not-configured" && <p className="account-error" role="alert">Customer sign-in needs SESSION_SECRET configured on the server.</p>}
            {params?.error === "missing-customer-details" && <p className="account-error" role="alert">Enter your name, email address, and phone number.</p>}
            {params?.error === "invalid-customer-details" && <p className="account-error" role="alert">Enter a valid email address and phone number.</p>}
            <form className="account-form" action={signInCustomer}>
              <input type="hidden" name="next" value={next} />
              <label htmlFor="customer-name">Full name</label>
              <input id="customer-name" name="name" autoComplete="name" maxLength={60} required />
              <label htmlFor="customer-email">Email address</label>
              <input id="customer-email" name="email" type="email" autoComplete="email" maxLength={254} required />
              <label htmlFor="customer-phone">Phone number</label>
              <input id="customer-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} required />
              <button type="submit" className="primary-button">Continue as customer</button>
            </form>
            <p className="account-notice">This demo uses these details to start a session but does not keep your email or phone number. It does not verify your identity or create a permanent account.</p>
            <p><Link href={`/staff/sign-in?next=${encodeURIComponent("/admin")}`}>Staff sign in</Link></p>
          </>
        )}
      </section>
    </main>
  );
}
