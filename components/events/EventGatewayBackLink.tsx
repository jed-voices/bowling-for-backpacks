import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type EventGatewayBackLinkProps = {
  tone: "bowling" | "gala";
  className?: string;
};

export function EventGatewayBackLink({
  tone,
  className = "",
}: EventGatewayBackLinkProps) {
  const toneClass = tone === "bowling" ? "bfb-secondary" : "button-quiet uppercase";

  return (
    <Link href="/supporters" className={`${toneClass} ${className}`.trim()}>
      <ArrowLeft aria-hidden="true" size={17} />
      Back to Events
    </Link>
  );
}
