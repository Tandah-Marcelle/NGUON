import { MessageCircle } from "lucide-react";

const WhatsAppOrderButton = ({
  phone, message, className = "", onHoverChange,
}: { phone: string; message: string; className?: string; onHoverChange?: (hovered: boolean) => void }) => (
  // Absolutely positioned relative to the row so it never sits in normal flex
  // flow — sizing changes on its sibling can't shift this button's own
  // position, which would otherwise un-hover it mid-animation.
  <div className={`absolute right-0 top-0 h-14 w-14 ${className}`}>
    <a
      href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      title="Order via WhatsApp"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className="group absolute right-0 top-0 z-10 flex items-center h-14 w-14 hover:w-[240px] rounded-full bg-green-500 text-white shadow-md hover:shadow-xl overflow-hidden transition-[width] duration-300 ease-out"
    >
      <span className="w-14 h-14 flex items-center justify-center flex-shrink-0">
        <MessageCircle size={20} />
      </span>
      <span className="whitespace-nowrap text-sm font-black pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
        Order via WhatsApp
      </span>
    </a>
  </div>
);

export default WhatsAppOrderButton;
