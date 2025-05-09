import { Helmet } from 'react-helmet';
import Footer from '../components/Footer';
import { useNavigate } from "react-router"
import { useEffect } from 'react';

export default function About() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>About | BioInsightPro</title>
                <meta name="description" content="BioInsightPro: Revolutionizing Medical Research with AI-Powered Insights" />
            </Helmet>
            <div className="relative text-lg w-full min-h-screen bg-transparent overflow-hidden">
                <div className="relative z-10 text-white max-w-4xl mx-auto px-6 lg:px-4 py-16 space-y-12">
                    {/* About Header with Gradient */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4 p-2">
                            About Bio Insight Pro
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-100">
                            Transforming Medical Research with Cutting-Edge AI
                        </h2>
                    </div>

                    {/* Sections with Card-like Design */}
                    <div className="space-y-12">
                        {/* Introduction */}
                        <div className="bg-[#0a172d] rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-4">Our Mission</h3>
                            <p className="text-gray-100 leading-relaxed">
                                We aim to revolutionize medical data analysis through advanced AI technologies.
                                Our platform empowers doctors and researchers to transform complex clinical documents, research papers,
                                and DNA sequences into actionable insights with unprecedented speed and accuracy.
                            </p>
                        </div>

                        {/* What We Do */}
                        <div className="bg-[#0a172d] rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">What We Do</h3>
                            <ul className="space-y-3 text-gray-100">
                                {[
                                    "Automated Medical Text Analysis",
                                    "DNA Sequence Alignment & Knowledge Discovery",
                                    "Context-Aware AI Engine",
                                    "User-Friendly Interface",
                                    "Strict Data Privacy & Compliance",
                                    "Integrated AI Assistant for QnA"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-cyan-400 mr-3">✦</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Team Section */}
                        <div className="bg-[#0a172d] rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-4">Meet Our Team</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    {
                                        name: "Dr. Supriya Gupta Bani",
                                        linkedin: "https://www.linkedin.com/in/supriya-gupta-74942777"
                                    },
                                    {
                                        name: "Om Aryan",
                                        linkedin: "https://omaryan.vercel.app"
                                    },
                                    {
                                        name: "Piyush Dhamecha",
                                        linkedin: "https://www.linkedin.com/in/piyush-dhamecha-524542289"
                                    },
                                    {
                                        name: "Mehansh Masih",
                                        linkedin: ""
                                    },
                                    {
                                        name: "Adarsh Gandhi",
                                        linkedin: ""
                                    },
                                    {
                                        name: "Harsh Saoji",
                                        linkedin: ""
                                    }
                                ].map((obj, index) => (
                                    <div key={index} className="bg-[#0a192f] cursor-pointer p-4 rounded-lg text-center hover:bg-black duration-300 hover:scale-[1.05]" onClick={() => window.open(obj.linkedin, "_blank")}>
                                        <p className="text-gray-100 font-bold tracking-wide">{obj.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     {/* Instructions */}
                    <div className="text-center py-10 bg-[#0a172d]">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-6">
                            Instructions and Procedure
                        </h3>

                        <div className="text-gray-100 text-left max-w-3xl mx-auto space-y-4 leading-relaxed">
                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                Upload two medical PDF files named <strong>doca.pdf</strong> and <strong>docb.pdf</strong>.
                            </p>

                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                The system will analyze and compare the documents, providing:
                            </p>

                            <ul className="list-none pl-6 space-y-1">
                                <li>
                                    <span className="text-cyan-600 mr-3">✦</span>
                                    Summary and key insights
                                </li>
                                <li>
                                    <span className="text-cyan-600 mr-3">✦</span>
                                    Notable similarities and differences (see <strong>Similarity</strong> page)
                                </li>
                                <li>
                                    <span className="text-cyan-600 mr-3">✦</span>
                                    A calculated similarity score
                                </li>
                                <li>
                                    <span className="text-cyan-600 mr-3">✦</span>
                                    User-friendly result display
                                </li>
                            </ul>

                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                Use the <strong>IntelliOnco</strong> page to ask questions about the documents
                            </p>

                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                Ensure documents are in <strong>PDF format</strong> and contain <strong>relevant medical information</strong>.
                            </p>

                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                After the analysis, click the button to view the <strong>Knowledge Graph</strong>.
                            </p>

                            <p>
                                <span className="text-cyan-400 mr-3">✦</span>
                                The <strong>BioMap</strong> page will visually display relationships and insights using the Knowledge Graph.
                            </p>
                        </div>
                    </div>
                    {/* Call to Action */}
                    <div className="text-center bg-[#0a172d] rounded-lg p-8 shadow-xl">
                        <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-4 p-2">Join Our Journey</h3>
                        <p className="text-gray-100 mb-6">
                            Unlock the potential of AI in medical research. Connect with Bio Insight Pro today and transform
                            how you analyze medical data.
                        </p>
                        <button className="my-10 mx-auto w-auto rounded text-lg font-semibold transition-all duration-300 px-5 py-3 bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee] mt-6"
                            onClick={() => navigate("/")}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
                <div className=''>
                    <Footer />
                </div>
            </div>
        </>
    );
}