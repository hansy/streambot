import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure } from "@headlessui/react";

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">StreamBot</div>
          </div>
          <div className="flex items-center">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
