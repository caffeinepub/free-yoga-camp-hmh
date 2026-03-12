export default function WhatsAppButton() {
  const channelUrl = "https://whatsapp.com/channel/0029VbCDQ4S2kNFrl6zvGj2o";
  const contactUrl = "https://wa.me/919057036745";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.button"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg px-4 py-3 transition-all hover:scale-105 hover:shadow-xl"
        aria-label="WhatsApp Channel जॉइन करें"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-6 h-6 flex-shrink-0"
          fill="currentColor"
          role="img"
          aria-label="WhatsApp"
        >
          <title>WhatsApp</title>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.474 2.027 7.779L0 32l8.451-2.007A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.773-1.853l-.486-.288-5.015 1.191 1.234-4.875-.318-.503A13.23 13.23 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667c7.364 0 13.333 5.969 13.333 13.333 0 7.364-5.969 13.333-13.333 13.333zm7.32-9.973c-.4-.2-2.368-1.168-2.736-1.301-.368-.133-.635-.2-.903.2-.267.4-1.035 1.301-1.268 1.568-.234.267-.467.3-.867.1-.4-.2-1.688-.623-3.215-1.983-1.188-1.059-1.99-2.368-2.224-2.768-.234-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.903-2.168-1.235-2.968-.325-.78-.657-.675-.903-.688l-.769-.013c-.267 0-.7.1-1.068.5-.368.4-1.401 1.368-1.401 3.335 0 1.967 1.434 3.867 1.634 4.134.2.267 2.82 4.302 6.832 6.034.955.413 1.7.66 2.28.844.958.306 1.83.263 2.52.16.769-.114 2.368-.968 2.702-1.902.334-.934.334-1.734.234-1.902-.1-.167-.368-.267-.769-.467z" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold">WhatsApp Channel</span>
          <span className="text-xs opacity-90">जॉइन करें</span>
        </div>
      </a>

      <a
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.contact.button"
        className="flex items-center gap-2 bg-white border border-[#25D366] text-[#25D366] hover:bg-[#f0fdf4] rounded-full shadow-md px-4 py-2 transition-all hover:scale-105 hover:shadow-lg"
        aria-label="तुषार वर्मा से संपर्क करें"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          role="img"
          aria-label="WhatsApp Contact"
        >
          <title>WhatsApp Contact</title>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.474 2.027 7.779L0 32l8.451-2.007A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.773-1.853l-.486-.288-5.015 1.191 1.234-4.875-.318-.503A13.23 13.23 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667c7.364 0 13.333 5.969 13.333 13.333 0 7.364-5.969 13.333-13.333 13.333zm7.32-9.973c-.4-.2-2.368-1.168-2.736-1.301-.368-.133-.635-.2-.903.2-.267.4-1.035 1.301-1.268 1.568-.234.267-.467.3-.867.1-.4-.2-1.688-.623-3.215-1.983-1.188-1.059-1.99-2.368-2.224-2.768-.234-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.903-2.168-1.235-2.968-.325-.78-.657-.675-.903-.688l-.769-.013c-.267 0-.7.1-1.068.5-.368.4-1.401 1.368-1.401 3.335 0 1.967 1.434 3.867 1.634 4.134.2.267 2.82 4.302 6.832 6.034.955.413 1.7.66 2.28.844.958.306 1.83.263 2.52.16.769-.114 2.368-.968 2.702-1.902.334-.934.334-1.734.234-1.902-.1-.167-.368-.267-.769-.467z" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-gray-800">तुषार वर्मा</span>
          <span className="text-xs">9057036745</span>
        </div>
      </a>
    </div>
  );
}
