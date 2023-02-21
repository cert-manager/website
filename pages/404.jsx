import Button from 'components/Button'
import Image from 'components/Image'

function PageNotFound() {
  return (
    <div className="container mt-6 pb-48">
      <div className="w-full md:grid grid-cols-12 gap-12 xl:ga p-16">
        <div className="col-span-4 lg:col-span-3 xl:col-span-3 md:border-r border-gray-2/50 pr-5">
          <Image
            src={'/images/cert-manager-404-illustration.svg'}
            height={360}
            width={625}
            alt="404 - Not found"
          />
        </div>
        <main className="col-span-8 lg:col-span-9 xl:col-span-7 docs ">
          <div className="mx-auto md:mx-0 max-w-full prose">
            <h1>
              Oops, We can&apos;t seem to find the page you are looking for.
            </h1>
            <p>
              The page you are looking for might have been removed, had its name
              changed, or be temporarily unavailable.
            </p>
          </div>
          <Button href={'/'} caption={'Back to home'} className="mt-5" />
        </main>
      </div>
    </div>
  )
}

export default PageNotFound
