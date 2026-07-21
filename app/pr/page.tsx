import { Suspense } from "react";
import { PrFilesPage } from "@/components/pr/PrFilesPage";

export default function Page() {
  return (
    <Suspense>
      <PrFilesPage />
    </Suspense>
  );
}
