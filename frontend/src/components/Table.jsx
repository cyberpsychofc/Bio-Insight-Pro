import React, { useState } from 'react';
import '../App.css'

const Table = () => {
    const [isDropdownVisible, setDropdownVisibility] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisibility(!isDropdownVisible);
    };

    return (
        <div className="mt-20 flex justify-center relative overflow-x-auto shadow-md sm:rounded-lg bg-whit">
            <table className="justify-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800"></th>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Color
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                            Category
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 bg-gray-700">
                            <button
                                onClick={toggleDropdown}
                                className={`px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded transform transition-transform duration-300 ${
                                    isDropdownVisible ? 'rotate-45' : ''
                                }`}
                            >
                                +
                            </button>
                        </td>
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                        >
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">Silver</td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">Laptop</td>
                    </tr>
                    {isDropdownVisible && (
                        <tr
                            className="border-b border-gray-200 dark:border-gray-700 transition-max-height"
                            style={{ maxHeight: isDropdownVisible ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.5s ease-in-out' }}
                        >
                            <td colSpan="4" className="px-6 py-4 bg-gray-100 dark:bg-gray-600">
                                Some additional information here
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
