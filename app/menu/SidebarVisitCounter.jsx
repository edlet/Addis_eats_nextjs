"use client";

import { useState } from "react";

export default function SidebarVisitCounter() {
  const [visits, setVisits] = useState(0);
  return <div className="sidebar-state"><p>Layout counter: <strong>{visits}</strong></p><button type="button" onClick={() => setVisits((count) => count + 1)}>Add a visit</button><small>This value stays when you open a dish because this layout remains mounted.</small></div>;
}
