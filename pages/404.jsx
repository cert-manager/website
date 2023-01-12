import Button from 'components/Button'
import Image from 'components/Image'

function PageNotFound() {
    return (
        <div className='pt-10 pb-20 px-10'>
            <Image
                src={'/images/cert-manager-404-illustration.svg'}
                height={360}
                width={625}
                alt="404 - Not found"
            />
            <h1 className="text-2xl mb-5 lg:mb-4 lg:text-4xl max-w-3xl">Oops, We can&apos;t seem to find
                the page you are looking for.</h1>
            <p className="text-base mb-5 lg:mb-14 lg:text-xl max-w-3xl">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button href={'/'} caption={'Back to home'} />
        </div>
    )
}

export default PageNotFound
