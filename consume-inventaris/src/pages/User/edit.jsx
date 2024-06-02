import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function UserEdit({ isOpen, onClose, endpoint, inputData, titleModal }) {
    const [dataDetail, setDataDetail] = useState({});
    const [error, setError] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            axios.get(endpoint['data_detail'], {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
            .then(res => {
                setDataDetail(res.data.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login?message=' + encodeURIComponent('anda belum login!!'));
                }
            });
        }
    }, [isOpen, endpoint, navigate]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setDataDetail(prevDataDetail => ({
            ...prevDataDetail,
            [name]: value
        }));
    }

    function handleUpdate(e) {
        e.preventDefault();
        axios.put(endpoint['update_user'], dataDetail, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('anda belum login'));
            } else {
                setError(err.response ? err.response.data : { message: 'Unknown error occurred' });
            }
        });
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div id="crud-modal" tabIndex="-1" aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Edit {titleModal}
                        </h3>
                        <button type="button" onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {Object.keys(error).length > 0 && (
                        <div role='alert'>
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                <ul>
                                    {Object.entries(error).map(([key, value]) => (
                                        <li key={key}>{typeof value === 'string' ? value : JSON.stringify(value)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <form className="p-4 md:p-5" onSubmit={handleUpdate}>
                        {Object.entries(inputData).map(([index, item]) => (
                            <div className="mb-6" key={index}>
                                {item.tag === "select" ? (
                                    <>
                                        <label htmlFor={index} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{index}</label>
                                        <select id={index} name={index} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
                                            rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            value={dataDetail[index]} onChange={handleInputChange}>
                                            {item['option'].map((opt, idx) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={index} className="block text-sm font-medium text-gray-900 dark:text-white capitalize mb-3">{index}</label>
                                        <input type={item.type} name={index} id={index} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
                                            rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            value={dataDetail[index]} onChange={handleInputChange} />
                                    </>
                                )}
                            </div>
                        ))}
                        <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                            Update {titleModal}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
