import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 pb-24 pt-16 text-cream md:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 border-t border-cream/12 pt-12 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-crimson/40">
              <Image src="/logo-mark.png" alt="" fill sizes="32px" className="object-cover" />
            </span>
            <p className="font-display text-2xl tracking-tight">ARNO</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/55">
            Mobile specialty coffee for events, communities and brands —
            wherever people gather.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-cream/40">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li><a href="#why" className="transition-colors hover:text-cream">Why ARNO</a></li>
              <li><a href="#locations" className="transition-colors hover:text-cream">Locations</a></li>
              <li><a href="#packs" className="transition-colors hover:text-cream">Packs</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/40">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li><a href="mailto:sports.arno@gmail.com" className="transition-colors hover:text-cream">sports.arno@gmail.com</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/40">Follow</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li><a href="https://www.instagram.com/arno__fam?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@arno_fam?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">TikTok</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1440px] flex-col-reverse items-start justify-between gap-4 text-xs text-cream/35 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} ARNO Coffee. All rights reserved.</p>
        <p>Made to move — mobile specialty coffee, Tunisia.</p>
      </div>
    </footer>
  );
}
