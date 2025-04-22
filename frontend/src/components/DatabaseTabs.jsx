import React, { useEffect, useState } from "react";
import { getDatabases } from "../getDatabase.js";

export default function DatabaseTabs({ onSelectDatabase }) {
  const [databases, setDatabases] = useState([]);
  const [activeDb, setActiveDb] = useState(""); // Track the selected database

  useEffect(() => {
    const fetchData = async () => {
      const dbs = await getDatabases();
      setDatabases(dbs);
      if (dbs.length > 0) {
        setActiveDb(dbs[0]); // Set the first database as default
        onSelectDatabase(dbs[0]); // Load the first database graph initially
      }
    };
    fetchData();
  }, []);

  const handleDatabaseClick = (db) => {
    setActiveDb(db);
    onSelectDatabase(db);
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700 z-10 top-[100px] left-0 right-0 backdrop-blur-md bg-transparent sticky">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        {databases.map((db, index) => (
          <li key={index} role="presentation" className="flex-grow">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg w-full ${
                activeDb === db
                  ? "border-cyan-300 text-cyan-300"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              type="button"
              onClick={() => handleDatabaseClick(db)}
              aria-controls={db}
              aria-selected={activeDb === db}
            >
              {db}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}