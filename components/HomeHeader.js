export default function HomeHeader() {
    return (
        <div className="text-blue-900 flex justify-between">
            <h1>Dashboard</h1>
            <h2 className="mt-0">
                <div className="flex gap-2 items-center">
                    <div>Hello, Administrator!</div>
                </div>
            </h2>
        </div>
    );
}