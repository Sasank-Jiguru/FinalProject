import React, { useState, useEffect } from 'react';

const buildfire = window.buildfire || {
    auth: {
        login: (options, callback) => {
            setTimeout(() => {
                const isSignup = options.allowLogin === false;
                const mockUser = {
                    id: 'bf-user-' + Date.now(),
                    displayName: isSignup ? 'New User' : 'Authenticated User',
                    email: isSignup ? 'newuser-' + Date.now().toString().slice(-4) + '@app.com' : 'authenticated@user.com',
                    imageUrl: 'https://placehold.co/50x50/d1d5db/1e293b?text=U',
                };
                localStorage.setItem('bf_user', JSON.stringify(mockUser));
                callback(null, mockUser);
            }, 1500);
        },
        logout: (callback) => {
            localStorage.removeItem('bf_user');
            setTimeout(() => {
                callback(null, { message: 'Logged out successfully' });
            }, 500);
        },
        getCurrentUser: (callback) => {
            const user = JSON.parse(localStorage.getItem('bf_user'));
            callback(null, user);
        }
    }
};
window.buildfire = buildfire;

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
];

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ${className}`}>
        {children}
    </div>
);

const MessageBox = ({ message, type, onClose }) => {
    if (!message) return null;
    
    const colors = {
        success: 'bg-green-100 text-green-800 border-green-400',
        error: 'bg-red-100 text-red-800 border-red-400',
        info: 'bg-blue-100 text-blue-800 border-blue-400',
    };

    return (
        <div className={`p-4 border-l-4 rounded-lg shadow-md mb-4 ${colors[type] || colors.info}`} role="alert">
            <div className="flex justify-between items-center">
                <p className="font-medium">{message}</p>
                <button onClick={onClose} className="text-xl font-bold ml-4">&times;</button>
            </div>
        </div>
    );
};

const FloatingInput = ({ label, type, name, value, onChange, required = false, className = '' }) => (
    <div className={`relative ${className}`}>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder=" "
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        />
        <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
            {label}
        </label>
    </div>
);

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4">
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4 leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};


const LoginView = ({ setCurrentUser, currentUser, setView }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [authMode, setAuthMode] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const closeModal = () => {
        setAuthMode(null);
        setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
    };

    const triggerBuildfireAuth = (action) => {
        setIsLoading(true);
        setMessage({ text: '', type: 'info' });
        
        let loginOptions = {};
        const isSignupAction = action === 'signup';

        if (isSignupAction) {
            loginOptions = { allowLogin: false };
        } else {
            loginOptions = { allowSignup: false };
        }

        buildfire.auth.login(loginOptions, (err, user) => {
            setIsLoading(false);
            closeModal();

            if (err) {
                setMessage({ 
                    text: `${isSignupAction ? 'Registration' : 'Login'} failed. Please try again.`, 
                    type: 'error' 
                });
                return;
            }
            if (user) {
                setCurrentUser(user);
                const actionType = isSignupAction ? 'registered' : 'logged in';
                setMessage({ 
                    text: `Success! You have successfully ${actionType} as ${user.displayName || 'User'}.`, 
                    type: 'success' 
                });
            } else {
                setMessage({ text: `Authentication cancelled.`, type: 'info' });
            }
        });
    };

    const handleLocalAuthSubmit = (e) => {
        e.preventDefault();
        
        if (authMode === 'signup') {
            if (formData.password !== formData.confirmPassword) {
                setMessage({ text: "Passwords do not match.", type: 'error' });
                return;
            }
            triggerBuildfireAuth('signup');
        } else if (authMode === 'login') {
            triggerBuildfireAuth('login');
        }
    };

    const handleLogout = () => {
        setIsLoading(true);
        setMessage({ text: '', type: 'info' });

        buildfire.auth.logout((err, result) => {
            setIsLoading(false);
            if (err) {
                setMessage({ text: 'Logout failed.', type: 'error' });
                return;
            }
            setCurrentUser(null);
            setMessage({ text: 'You have been successfully logged out.', type: 'info' });
            setView('home');
        });
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLocalAuthSubmit} className="space-y-6">
            <p className="text-sm text-gray-500">The credentials entered here will trigger the native BuildFire login flow.</p>
            <FloatingInput 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                required 
            />
            <FloatingInput 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                required 
            />
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg disabled:bg-indigo-400"
            >
                {isLoading ? 'Connecting...' : 'Login'}
            </button>
        </form>
    );

    const renderSignupForm = () => (
        <form onSubmit={handleLocalAuthSubmit} className="space-y-6">
            <p className="text-sm text-gray-500">The credentials entered here will trigger the native BuildFire registration flow.</p>
            <div className="grid grid-cols-2 gap-4">
                <FloatingInput 
                    label="First Name" 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleFormChange} 
                    required 
                />
                <FloatingInput 
                    label="Last Name" 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleFormChange} 
                    required 
                />
            </div>
            <FloatingInput 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                required 
            />
            <FloatingInput 
                label="Password (min 6 chars)" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                required 
            />
            <FloatingInput 
                label="Confirm Password" 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleFormChange} 
                required 
            />
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg disabled:bg-purple-400"
            >
                {isLoading ? 'Connecting...' : 'Sign Up'}
            </button>
        </form>
    );
    
    let content;
    if (currentUser) {
        content = (
            <div className="space-y-4 mt-6">
                <img src={currentUser.imageUrl || 'https://placehold.co/50x50/cccccc/ffffff?text=U'} alt="User Avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-indigo-400" />
                <p className="text-2xl font-semibold text-gray-800">{currentUser.displayName}</p>
                <p className="text-gray-500">{currentUser.email}</p>
                <button 
                    onClick={handleLogout} 
                    disabled={isLoading}
                    className="w-full bg-red-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors shadow-md disabled:bg-red-300"
                >
                    {isLoading ? 'Logging Out...' : 'Logout'}
                </button>
            </div>
        );
    } else {
        content = (
            <div className="space-y-4 mt-6">
                <p className="text-gray-600 mb-6">
                    Use one of the options below to proceed.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setAuthMode('login')} 
                        className="w-1/2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setAuthMode('signup')} 
                        className="w-1/2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="p-10 w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-6">{currentUser ? 'Account Profile' : 'Secure Authentication'}</h2>
                
                <MessageBox 
                    message={message.text} 
                    type={message.type} 
                    onClose={() => setMessage({ text: '', type: 'info' })}
                />
                
                {content}
                {isLoading && !currentUser && <p className="text-sm text-gray-500 mt-4">Connecting to BuildFire...</p>}
            </Card>

            <Modal isOpen={authMode === 'login'} onClose={closeModal} title="User Login">
                {renderLoginForm()}
            </Modal>

            <Modal isOpen={authMode === 'signup'} onClose={closeModal} title="Create Account">
                {renderSignupForm()}
            </Modal>
        </div>
    );
};

const HomePage = ({ onNavigate }) => (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">ValuePlus Homes</h1>
            <p className="text-xl text-gray-600 mb-8">Unlock the True Potential of Your Property.</p>
            <p className="max-w-2xl mx-auto text-gray-500 mb-10">
                Design solutions and ideas to enhance the value of residential properties for the Indian middle class. Our platform provides recommendations and tools to make homes more attractive and valuable.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
                <button onClick={() => onNavigate('user')} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    I'm a Homeowner
                </button>
                <button onClick={() => onNavigate('login')} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Login / Account
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
    const [message, setMessage] = useState({ text: '', type: 'info' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!propertyDetails.sqft || !propertyDetails.budget) {
            setMessage({ text: "Please fill in all fields (Area and Budget).", type: 'error' });
            return;
        }
        setMessage({ text: '', type: 'info' });
        const recs = recommendations.filter(r => r.cost <= propertyDetails.budget);
        setPersonalizedRecs(recs);
        setIsSubmitted(true);
    };

    return (
        <div className="space-y-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-4 border-indigo-200">Get Personalized Recommendations</h2>
                <MessageBox 
                    message={message.text} 
                    type={message.type} 
                    onClose={() => setMessage({ text: '', type: 'info' })}
                />
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{personalizedRecs.length > 0 ? "Here are some budget-friendly ideas for you:" : "No recommendations found for your budget. Try increasing your budget!"}</h3>
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


const AdminView = ({ recommendations, setRecommendations, properties }) => {
    const [recForm, setRecForm] = useState({ title: '', description: '', cost: '', value_add_percent: '', category: 'Interior', image: '' });
    
    const [message, setMessage] = useState({ text: '', type: 'info' });

    const handleRecChange = (e) => {
        const { name, value } = e.target;
        setRecForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRecommendation = (e) => {
        e.preventDefault();
        if(!recForm.title || !recForm.cost) {
            setMessage({ text: "Please fill Title and Cost.", type: 'error' });
            return;
        }
        setMessage({ text: '', type: 'info' });
        const newRec = { 
            ...recForm, 
            id: Date.now(), 
            cost: Number(recForm.cost), 
            value_add_percent: Number(recForm.value_add_percent || 0) 
        };
        setRecommendations(prev => [newRec, ...prev]);
        setRecForm({ title: '', description: '', cost: '', value_add_percent: '', category: 'Interior', image: '' });
        setMessage({ text: `Recommendation '${newRec.title}' added successfully!`, type: 'success' });
    };

    const handleDeleteRecommendation = (id) => {
        setRecommendations(recommendations.filter(rec => rec.id !== id));
        setMessage({ text: `Recommendation ID ${id} deleted.`, type: 'info' });
    };

    return (
        <div className="space-y-12">
            <MessageBox 
                message={message.text} 
                type={message.type} 
                onClose={() => setMessage({ text: '', type: 'info' })}
            />
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Recommendations</h2>
                <form onSubmit={handleAddRecommendation} className="space-y-4 mb-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-700">Add New Recommendation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={recForm.title} onChange={handleRecChange} placeholder="Title" className="w-full p-2 border rounded" required />
                        <input name="cost" type="number" value={recForm.cost} onChange={handleRecChange} placeholder="Estimated Cost (₹)" className="w-full p-2 border rounded" required />
                        <textarea name="description" value={recForm.description} onChange={handleRecChange} placeholder="Description" className="w-full p-2 border rounded md:col-span-2" rows="2"></textarea>
                        <input name="value_add_percent" type="number" value={recForm.value_add_percent} onChange={handleRecChange} placeholder="Value Add % (e.g., 5)" className="w-full p-2 border rounded" />
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

            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Property Listings (For Reference)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {properties.map(prop => <PropertyCard key={prop.id} prop={prop} />)}
                </div>
            </div>
        </div>
    );
};

const RecommendationCard = ({ rec }) => {
    return (
        <Card>
            <img className="w-full h-48 object-cover" src={rec.image} alt={rec.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }} />
            <div className="p-6">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">{rec.category}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">{rec.description}</p>
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

export default function App() {
    const [view, setView] = useState('home');
    const [recommendations, setRecommendations] = useState(initialRecommendations);
    const [properties, ] = useState(initialProperties);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        buildfire.auth.getCurrentUser((err, user) => {
            if (user && user.id) {
                setCurrentUser(user);
            }
        });
    }, []);
    
    const Header = () => (
          <header className="bg-white shadow-md w-full mb-10 rounded-2xl">
              <nav className="container mx-auto px-6 py-4 flex justify-between items-center flex-wrap">
                  <div onClick={() => setView('home')} className="cursor-pointer py-2">
                      <h1 className="text-2xl font-bold text-indigo-600">ValuePlus Homes</h1>
                  </div>
                  <div className="flex items-center space-x-5 py-2">
                      <button onClick={() => setView('home')} className={`font-semibold transition-colors ${view === 'home' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Home</button>
                      <button onClick={() => setView('user')} className={`font-semibold transition-colors ${view === 'user' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Homeowner Ideas</button>
                      <button onClick={() => setView('admin')} className={`font-semibold transition-colors ${view === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Admin</button>
                      
                      <button onClick={() => setView('login')} className={`font-semibold transition-colors flex items-center gap-1 ${view === 'login' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>
                          {currentUser ? (
                              <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  Account
                              </>
                          ) : (
                              <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                  Login
                              </>
                          )}
                      </button>
                  </div>
              </nav>
          </header>
    );

    const renderView = () => {
        switch (view) {
            case 'user':
                return <UserView recommendations={recommendations} />;
            case 'admin':
                if (!currentUser || currentUser.email !== 'authenticated@user.com') { // Using the mock user email for simplicity
                    return <div className="text-center p-12 bg-white rounded-xl shadow-xl"><h2 className="text-3xl font-bold text-red-500">Access Denied</h2><p className="text-gray-600 mt-4">To view the admin dashboard, please log in. (Note: Only the mock user 'authenticated@user.com' has access in this demo.)</p><button onClick={() => setView('login')} className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition">Go to Login</button></div>;
                }
                return <AdminView 
                            recommendations={recommendations} 
                            setRecommendations={setRecommendations} 
                            properties={properties} 
                        />;
            case 'login':
                return <LoginView currentUser={currentUser} setCurrentUser={setCurrentUser} setView={setView} />;
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