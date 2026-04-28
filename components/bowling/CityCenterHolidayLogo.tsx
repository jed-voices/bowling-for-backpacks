import Image from "next/image";

type CityCenterHolidayLogoProps = {
  className?: string;
};

export function CityCenterHolidayLogo({ className = "" }: CityCenterHolidayLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 text-bfb-navy ${className}`}>
      <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center">
        <Image
          src="/bowling/cij-cc-logo.svg"
          alt=""
          width={64}
          height={64}
          priority
          className="h-16 w-16 object-contain"
        />
      </span>
      <span className="font-heading text-base font-black uppercase leading-none sm:text-lg">
        City Center
      </span>
    </span>
  );
}
