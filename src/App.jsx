import React, { useState, useEffect } from 'react';

// --- Mock Data ---
const initialRecommendations = [
    {
        id: 1,
        title: 'Modular Kitchen Upgrade',
        description: 'Upgrade to a modern modular kitchen with chimney, hob, and smart storage solutions. Increases appeal to modern families.',
        cost: 150000,
        value_add_percent: 10,
        category: 'Interior',
        image: 'https://placehold.co/600x400/a7f3d0/1e293b?text=Modular+Kitchen',
    },
    {
        id: 2,
        title: 'Install Energy Efficient Windows',
        description: 'Replace old windows with double-glazed units. Reduces energy bills and noise pollution, a major plus in urban areas.',
        cost: 80000,
        value_add_percent: 5,
        category: 'Exterior',
        image: 'https://placehold.co/600x400/bae6fd/1e293b?text=Efficient+Windows',
    },
    {
        id: 3,
        title: 'Smart Home Integration',
        description: 'Install smart lights, fans, and a smart lock. Highly attractive to tech-savvy buyers and adds a modern touch.',
        cost: 50000,
        value_add_percent: 7,
        category: 'Technology',
        image: 'https://placehold.co/600x400/fecaca/1e293b?text=Smart+Home',
    },
    {
        id: 4,
        title: 'Terrace Garden/Rooftop Oasis',
        description: 'Create a beautiful terrace garden. Adds a green space for relaxation, which is a luxury in city apartments.',
        cost: 60000,
        value_add_percent: 8,
        category: 'Exterior',
        image: 'https://placehold.co/600x400/e9d5ff/1e293b?text=Rooftop+Garden',
    },
    {
        id: 5,
        title: 'Modern Bathroom Remodel',
        description: 'Update bathroom fittings, tiles, and lighting. A clean, modern bathroom significantly boosts property value.',
        cost: 120000,
        value_add_percent: 9,
        category: 'Interior',
        image: 'https://placehold.co/600x400/fef08a/1e293b?text=Modern+Bathroom',
    },
];

const initialProperties = [
    {
        id: 1,
        address: '2BHK, Green Park, New Delhi',
        type: 'Apartment',
        sqft: 1100,
        current_value: 12000000,
        image: 'https://placehold.co/600x400/a5f3fc/1e293b?text=Delhi+2BHK'
    },
    {
        id: 2,
        address: '3BHK Villa, HSR Layout, Bengaluru',
        type: 'Villa',
        sqft: 2000,
        current_value: 25000000,
        image: 'https://placehold.co/600x400/fbcfe8/1e293b?text=Bengaluru+Villa'
    },
];


// --- Helper Components ---

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ${className}`}>
        {children}
    </div>
);

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                {children}
            </div>
        </div>
    );
};


// --- Main Views ---

const HomePage = ({ onNavigate }) => (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">ValuePlus Homes</h1>
            <p className="text-xl text-gray-600 mb-8">Unlock the True Potential of Your Property.</p>
            <p className="max-w-2xl mx-auto text-gray-500 mb-10">
                Design solutions and ideas to enhance the value of residential properties for the Indian middle class. Our platform provides recommendations and tools to make homes more attractive and valuable.
            </p>
            <div className="flex justify-center gap-6">
                <button onClick={() => onNavigate('user')} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    I'm a Homeowner
                </button>
                <button onClick={() => onNavigate('admin')} className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    I'm an Admin
                </button>
            </div>
        </div>
    </div>
);

const UserView = ({ recommendations }) => {
    const [propertyDetails, setPropertyDetails] = useState({
        type: 'Apartment',
        sqft: '',
        budget: '',
    });
    const [personalizedRecs, setPersonalizedRecs] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!propertyDetails.sqft || !propertyDetails.budget) {
            alert("Please fill in all fields.");
            return;
        }
        // Simple recommendation logic: filter by budget
        const recs = recommendations.filter(r => r.cost <= propertyDetails.budget);
        setPersonalizedRecs(recs);
        setIsSubmitted(true);
    };

    return (
        <div className="space-y-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-4 border-indigo-200">Get Personalized Recommendations</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select name="type" value={propertyDetails.type} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>Apartment</option>
                            <option>Villa</option>
                            <option>Independent House</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Area (in sq. ft.)</label>
                        <input type="number" name="sqft" placeholder="e.g., 1200" value={propertyDetails.sqft} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Budget (₹)</label>
                        <input type="number" name="budget" placeholder="e.g., 200000" value={propertyDetails.budget} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    <div className="md:col-span-3 text-center mt-4">
                        <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 shadow-md transform hover:scale-105">
                            Generate Ideas
                        </button>
                    </div>
                </form>
            </div>

            {isSubmitted && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{personalizedRecs.length > 0 ? "Here are some ideas for you:" : "No recommendations found for your budget."}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {personalizedRecs.map(rec => <RecommendationCard key={rec.id} rec={rec} />)}
                    </div>
                </div>
            )}
            
            <div>
                 <h2 className="text-3xl font-bold text-gray-800 my-8 border-b-2 pb-4 border-indigo-200">Explore All Enhancement Ideas</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.map(rec => <RecommendationCard key={rec.id} rec={rec} />)}
                </div>
            </div>

        </div>
    );
};


const AdminView = ({ recommendations, setRecommendations, properties, setProperties }) => {
    const [recForm, setRecForm] = useState({ title: '', description: '', cost: '', value_add_percent: '', category: 'Interior', image: '' });
    const [propForm, setPropForm] = useState({ address: '', type: 'Apartment', sqft: '', current_value: '', image: '' });

    const handleRecChange = (e) => {
        const { name, value } = e.target;
        setRecForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePropChange = (e) => {
        const { name, value } = e.target;
        setPropForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRecommendation = (e) => {
        e.preventDefault();
        if(!recForm.title || !recForm.cost) {
             alert("Please fill Title and Cost.");
             return;
        }
        const newRec = { ...recForm, id: Date.now(), cost: Number(recForm.cost), value_add_percent: Number(recForm.value_add_percent) };
        setRecommendations(prev => [newRec, ...prev]);
        setRecForm({ title: '', description: '', cost: '', value_add_percent: '', category: 'Interior', image: '' });
    };

    const handleDeleteRecommendation = (id) => {
        setRecommendations(recommendations.filter(rec => rec.id !== id));
    };

    return (
        <div className="space-y-12">
            {/* Manage Recommendations */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Recommendations</h2>
                <form onSubmit={handleAddRecommendation} className="space-y-4 mb-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-700">Add New Recommendation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={recForm.title} onChange={handleRecChange} placeholder="Title" className="w-full p-2 border rounded" />
                        <input name="cost" type="number" value={recForm.cost} onChange={handleRecChange} placeholder="Estimated Cost (₹)" className="w-full p-2 border rounded" />
                        <textarea name="description" value={recForm.description} onChange={handleRecChange} placeholder="Description" className="w-full p-2 border rounded md:col-span-2" rows="3"></textarea>
                        <input name="value_add_percent" type="number" value={recForm.value_add_percent} onChange={handleRecChange} placeholder="Value Add %" className="w-full p-2 border rounded" />
                         <select name="category" value={recForm.category} onChange={handleRecChange} className="w-full p-2 border rounded">
                            <option>Interior</option>
                            <option>Exterior</option>
                            <option>Technology</option>
                            <option>Sustainability</option>
                        </select>
                        <input name="image" value={recForm.image} onChange={handleRecChange} placeholder="Image URL" className="w-full p-2 border rounded md:col-span-2" />
                    </div>
                    <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all">Add Recommendation</button>
                </form>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {recommendations.map(rec => (
                        <div key={rec.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                            <div>
                                <h4 className="font-bold text-gray-800">{rec.title}</h4>
                                <p className="text-sm text-gray-600">Cost: ₹{rec.cost.toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={() => handleDeleteRecommendation(rec.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

             {/* Manage Properties */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                 <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Property Listings</h2>
                 {/* Admin can view listings here */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {properties.map(prop => <PropertyCard key={prop.id} prop={prop} />)}
                 </div>
            </div>
        </div>
    );
};


// --- Card Components ---
const RecommendationCard = ({ rec }) => {
    return (
        <Card>
            <img className="w-full h-48 object-cover" src={rec.image} alt={rec.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }} />
            <div className="p-6">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">{rec.category}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{rec.description}</p>
                <div className="flex justify-between items-center text-sm font-medium">
                    <div className="text-gray-700">
                        <p>Est. Cost</p>
                        <p className="font-bold text-lg text-indigo-600">₹{rec.cost.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right text-green-700">
                        <p>Value Add</p>
                        <p className="font-bold text-lg">~ {rec.value_add_percent}%</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};


const PropertyCard = ({ prop }) => {
     return (
        <Card>
            <img className="w-full h-48 object-cover" src={prop.image} alt={prop.address} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}/>
            <div className="p-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2">{prop.address}</h3>
                 <div className="text-gray-600 text-sm space-y-1">
                    <p><span className="font-semibold">Type:</span> {prop.type}</p>
                    <p><span className="font-semibold">Area:</span> {prop.sqft} sq. ft.</p>
                    <p><span className="font-semibold">Current Value:</span> ₹{prop.current_value.toLocaleString('en-IN')}</p>
                 </div>
            </div>
        </Card>
     );
};


// --- Main App Component ---

export default function App() {
    const [view, setView] = useState('home'); // 'home', 'user', 'admin'
    const [recommendations, setRecommendations] = useState(initialRecommendations);
    const [properties, setProperties] = useState(initialProperties);
    
    const Header = () => (
         <header className="bg-white shadow-md w-full mb-10 rounded-2xl">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div onClick={() => setView('home')} className="cursor-pointer">
                    <h1 className="text-2xl font-bold text-indigo-600">ValuePlus Homes</h1>
                </div>
                <div className="flex items-center space-x-5">
                    <button onClick={() => setView('home')} className={`font-semibold transition-colors ${view === 'home' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Home</button>
                    <button onClick={() => setView('user')} className={`font-semibold transition-colors ${view === 'user' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>User View</button>
                    <button onClick={() => setView('admin')} className={`font-semibold transition-colors ${view === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Admin View</button>
                </div>
            </nav>
        </header>
    );

    const renderView = () => {
        switch (view) {
            case 'user':
                return <UserView recommendations={recommendations} />;
            case 'admin':
                return <AdminView 
                            recommendations={recommendations} 
                            setRecommendations={setRecommendations} 
                            properties={properties} 
                            setProperties={setProperties}
                        />;
            default:
                return <HomePage onNavigate={setView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header />
                <main>
                    {renderView()}
                </main>
            </div>
        </div>
    );
}

