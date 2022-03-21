import Link from 'next/link'
import FooterSepartor from './snippets/FooterSeparator'

export default function Footer() {
  return (
    <footer className="-mt-117px">
      <div className="relative w-screen h-117px overflow-x-hidden">
        <FooterSepartor className="absolute top-0 -left-696px" />
      </div>
      <div className="bg-dark-2 pb-10 pt-5">
        <div className="container text-sm text-white">
          <p>&copy; 2022 The cert-manager Authors.</p>
          <p className="mb-6">
            &copy; 2022 The Linux Fundation. All rights reserved.
          </p>
          <p>
            The Linux Foundation has registered trademarks and uses trademarks.
          </p>
          <p>
            For a list of trademarks of The Linux Foundation, please see our
            &nbsp;
            <Link href="https://www.linuxfoundation.org/trademark-usage/">
              <a target="_blank" className="no-underline">
                Trademark Usage page.
              </a>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
