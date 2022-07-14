import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Navbar() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const isStreamPage = router.pathname === "/streams/[streamId]";

  return (
    <Disclosure as="nav" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="noto text-2xl">StreamBot</a>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isStreamPage && isConnected && (
              <ConnectButton chainStatus="none" showBalance={false} />
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
