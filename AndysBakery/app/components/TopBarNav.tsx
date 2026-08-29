
import Link from 'next/link';


export default function TopBarNav() {
    return (
        <>
            <div className="topBar">
                <div className="topBarContainer">
                    <div className="topBarContent">
                        <Link href="/" className="topBarItem">Home</Link>
                        <Link href="/services" className="topBarItem">Order</Link>
                        <Link href="/gallery" className="topBarItem">Gallery</Link>
                        <Link href='/contact' className="topBarItem">Contact</Link> 
                        <Link href='/policies' className="topBarItem">Policies</Link>

                    </div>
                </div>



            </div>


        </>
    )
}