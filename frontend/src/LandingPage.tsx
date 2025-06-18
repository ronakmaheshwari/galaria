import { Button } from "@/components/ui/button";
import heroImage from "@/assets/Hero.png";


const navItems = [
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Plans & Pricing", href: "#pricing" },
    { label: "Gallery App", href: "#app" },
    { label: "Support", href: "#support" },
    { label: "Docs", href: "#docs" },
    { label: "About Us", href: "#about" },
    { label: "Login", href: "/signin" }, // or "Language" if you prefer
];


const LandingPage = () => {
    return (

        <div className="font-sans min-h-screen bg-white text-gray-900 mx-auto">
            {/* Header */}
            
            <header className="flex items-center justify-between px-6 md:px-10 py-6 shadow-sm ">
                <div className="text-2xl font-extrabold text-purple-700">Galeria</div>
                <nav className="hidden md:flex gap-6 text-gray-700 text-sm ">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="hover:text-purple-700 transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="flex gap-3">
                    <a href="/signin">
                        <Button variant="outline" className="text-sm border-black">
                            Sign In
                        </Button>
                    </a>
                    <a href="/signup">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-sm">
                            Create an account
                        </Button>
                    </a>
                </div>
            </header>

            {/* Hero */}
            
            <section className="px-6 md:px-12 py-16 text-center relative overflow-hidden">
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Store and share your photos & videos
                    <br />
                    with ease —  <span className="text-purple-700">anytime, anywhere</span>
                </h1>
                <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-600">
                    Galeria is your personal cloud drive for uploading, organizing,
                    and sharing media files securely with your team or friends.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <a href="/signup">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-base px-6 py-3">
                            Get Started
                        </Button>
                    </a>
                    <a href="/pricing">
                        <Button variant="outline" className="border-black text-base px-6 py-3">
                            Pricing
                        </Button>
                    </a>
                </div>
           
                {/* Illustrations */}
                <div className="relative mt-16 flex justify-center">
                    <div className="relative w-full max-w-6xl">
                        <img src={heroImage} alt="Main UI" className="w-full" />

                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
