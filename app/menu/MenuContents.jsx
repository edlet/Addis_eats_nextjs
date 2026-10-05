// Static menu shell. Interactive controls are separate client leaves.
export default function MenuContents({ children }) {
  return <main className="menu page-section"><div className="menu-header"><div><p className="section-kicker">Chef&apos;s picks</p><h1>Today&apos;s menu</h1></div></div>{children}</main>;
}
