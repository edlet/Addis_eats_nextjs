import Link from "next/link";
import { signInStaff, signOut } from "../../actions/auth";
import { getSession, safeNext } from "../../lib/session";

export const metadata = { title: "Staff sign in | Addis Eats" };

export default async function StaffSignInPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const next = safeNext(params?.next, "/staff/orders");

  return (
    <main className="account-page">
      <section className="account-card" aria-labelledby="staff-sign-in-title">
        <p className="section-kicker">Addis Eats operations</p>
        <h1 id="staff-sign-in-title">Staff sign in</h1>
        {session?.role === "staff" ? (
          <>
            <p>Your staff session is active.</p>
            <Link href="/staff/orders" className="primary-button">Open order desk</Link>
          </>
        ) : (
          <>
            <p>Use the staff access code provided by your administrator.</p>
            {session && <p className="account-error" role="alert">You are signed in as a customer. Sign out before using a staff account.</p>}
            {params?.auth === "not-configured" && <p className="account-error" role="alert">Staff sign-in needs SESSION_SECRET configured on the server.</p>}
            {params?.error === "invalid-staff-code" && <p className="account-error" role="alert">The staff access code was not accepted.</p>}
            {!session && <form className="account-form" action={signInStaff}>
              <input type="hidden" name="next" value={next} />
              <label htmlFor="staff-access-code">Staff access code</label>
              <input id="staff-access-code" name="staffCode" type="password" autoComplete="current-password" required />
              <button type="submit" className="primary-button">Sign in to staff console</button>
            </form>}
            {session ? (
              <form className="account-form" action={signOut}>
                <button type="submit" className="primary-button">Sign out to switch accounts</button>
              </form>
            ) : (
              <p><Link href="/sign-in">Customer sign in</Link></p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
