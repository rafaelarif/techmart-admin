import {useSession} from "next-auth/react";

export default function HomeHeader() {
    const {data: session} = useSession();
    return (
        <div className="text-blue-900 flex justify-between">
            <h1>Dashboard</h1>
            <h2 className="mt-0">
                <div className="flex gap-2 items-center">
                    <img
                        src={session?.user?.image}
                        alt=""
                        className="w-6 h-6 rounded-md sm:hidden"
                    />
                    <div>Hello, Administrator!</div>
                </div>
            </h2>
        </div>
    );
}