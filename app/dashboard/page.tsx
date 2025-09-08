import { connection } from "next/server";
import DashboardClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connection();
  return <DashboardClient />;
}
