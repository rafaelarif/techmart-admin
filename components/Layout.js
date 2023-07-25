import Nav from "@/components/Nav"
import {useSession, signIn} from "next-auth/react"
import {useState, useEffect} from "react";
import Logo from "./Logo";

export default function Layout({children}) {
    const [showNav, setShowNav] = useState(false);
    const {data: session, status} = useSession();

    useEffect(() => {
        if (status === 'loading') return
        if (!session) return signIn()
    }, [session, status])

    return (
        session ? (
            <div className="bg-bgGray min-h-screen">
                <div className="md:hidden flex items-center p-4">
                    <button onClick={() => setShowNav(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="flex grow justify-center mr-6">
                        <Logo />
                    </div>
                </div>
                <div className="flex">
                    <Nav show={showNav} />
                    <div className="flex-grow rounded-lg p-4">
                        {children}
                    </div>
                </div>
            </div>
        ) : null
    )
}