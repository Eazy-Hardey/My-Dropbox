// import React, { useRef, useState } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../../components/store/AuthStore';
// import { Oval } from 'react-loader-spinner';
// import Alert from '../../ui/alerts/Alert';

// const UpdateProfile = () => {
//     const emailRef = useRef();
//     const passwordRef = useRef();
//     const passwordConfirmRef = useRef();
//     const { currentUser, updatePassword, updateEmail } = useAuth();
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const emailField = emailRef.current.value;
//         const passwordField = passwordRef.current.value;
//         const passwordConfirmField = passwordConfirmRef.current.value;

//         if(passwordField !== passwordConfirmField) {
//             return setError("Passwords don't match!");
//         }

//         const promises = []
//         setLoading(true);
//         setError('');
//         if(emailField !== currentUser.email) {
//             promises.push(updateEmail(emailField));
//         }
//         if(passwordField) {
//             promises.push(updatePassword(passwordField));
//         }

//         Promise.all(promises).then(() => {
//             navigate("/");
//         }).catch(() => {
//             setError("Failed to update account!");
//         }).finally(() => {
//             setLoading(false);
//         })
//     }
//     return (
//         <>
//         <div className="h-screen flex items-center justify-center bg-slate-100">
//             <div className="max-w-xs w-full space-y-8">
//                 <div>
//                     <h2 className="text-center text-3xl tracking-tight font-bold text-gray-900">
//                         Profile
//                     </h2>
//                 </div>
//                 {
//                     error && (
//                         <Alert type={"error"}>{ error }</Alert>
//                     )
//                 }
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <input type="hidden" name="remember" defaultValue="true" />
//                     <div>
//                         <div>
//                             <label htmlFor="email-address" className="sr-only">
//                                 Email
//                             </label>
//                             <input
//                                 defaultValue={currentUser.email}
//                                 ref={emailRef}
//                                 id="email-address"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Email"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="sr-only">
//                                 Password
//                             </label>
//                             <input
//                                 ref={passwordRef}
//                                 id="password"
//                                 name="password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 className="mt-4 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Leave blank to keep the same"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="password-confirm" className="sr-only">
//                                 Password Confirm
//                             </label>
//                             <input
//                                 ref={passwordConfirmRef}
//                                 id="password-confirm"
//                                 name="password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 className="mt-4 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Leave blank to keep the same"
//                             />
//                         </div>
//                     </div>
        
//                     <div>
//                         <button
//                             type="submit"
//                             className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         >
//                             <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                 {
//                                     loading &&
//                                     <Oval
//                                     height={17}
//                                     width={17}
//                                     color="#fff"
//                                     wrapperStyle={{}}
//                                     wrapperClass=""
//                                     visible={true}
//                                     ariaLabel='oval-loading'
//                                     secondaryColor="#fff"
//                                     strokeWidth={4}
//                                     strokeWidthSecondary={2}
//                                     />
//                                 }
//                             </span>
//                             Update Profile
//                         </button>
//                     </div>
//                     <div className="!mt-4">
//                         <Link className="font-medium text-indigo-600 hover:text-indigo-500" to={"/"}>Cancel</Link>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     </>
//     );
// };

// export default UpdateProfile;
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../components/store/AuthStore';
import { Oval } from 'react-loader-spinner';
import Alert from '../../ui/alerts/Alert';
import { database } from '../../firebase'; // Ensure this is the correct path to your firebase configuration

const UpdateProfile = () => {
    const emailRef = useRef();
    const nameRef = useRef();
    const { currentUser, updateEmail } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from Firestore on component mount
        const fetchUserData = async () => {
            try {
                const userDoc = await database.users.doc(currentUser.uid).get();
                if (userDoc.exists) {
                    setUserData(userDoc.data());
                }
            } catch (err) {
                setError("Failed to load user data.");
            }
        };

        fetchUserData();
    }, [currentUser.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailField = emailRef.current.value;
        const nameField = nameRef.current.value;

        setLoading(true);
        setError('');

        try {
            const userDoc = await database.users.doc(currentUser.uid).get();

            if (!userDoc.exists) {
                // If the document doesn't exist, create it
                await database.users.doc(currentUser.uid).set({
                    name: nameField,
                    email: emailField
                });
            } else {
                // If it exists, update it
                await database.users.doc(currentUser.uid).update({
                    name: nameField,
                    email: emailField
                });
            }

            // Update email if it has changed
            if (emailField !== currentUser.email) {
                await updateEmail(emailField);
            }

            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to update profile!");
            console.error(err); // Log error for debugging
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="h-screen flex items-center justify-center bg-slate-100">
                <div className="max-w-xs w-full space-y-8">
                    <div>
                        <h2 className="text-center text-3xl tracking-tight font-bold text-gray-900">
                            {userData.name || "Loading..."} {/* Display only the name */}
                        </h2>
                    </div>
                    {
                        error && (
                            <Alert type={"error"}>{error}</Alert>
                        )
                    }
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                defaultValue={userData.name} // Display current user's name
                                ref={nameRef}
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email
                            </label>
                            <input
                                defaultValue={userData.email} // Display current user's email
                                ref={emailRef}
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {loading && (
                                        <Oval
                                            height={17}
                                            width={17}
                                            color="#fff"
                                            visible={true}
                                            ariaLabel='oval-loading'
                                        />
                                    )}
                                </span>
                                Update Profile
                            </button>
                        </div>
                        <div className="!mt-4">
                            <Link className="font-medium text-indigo-600 hover:text-indigo-500" to={"/"}>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateProfile;
