import { useState, useEffect, useCallback } from "react";

function customDebounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

function App() {
  const [query, setQuery] = useState(""); //Stato della Richiesta API
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true); // Fine caricamento

    try {
      const call = await fetch(
        `http://localhost:5001/products?search=${query}`
      );
      const resCall = await call.json();
      setResults(resCall);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Fine caricamento
    }
  };

  const debFecth = useCallback(customDebounce(fetchProducts, 500), []);

  useEffect(() => {
    debFecth(query);
  }, [query]);

  return (
    <>
      <div className="containerSearch">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un Prodotto..."
        />

        {isLoading && <p>Caricamento...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && results.length > 0 && (
          <ul className="suggestions-list">
            {results.map((item) => (
              <li className="singleProducts" key={item.id}>
                <p className="productName"> {item.name}</p>{" "}
                <p className="productBrand"> {item.brand}</p>{" "}
                <img src={item.image} alt={item.name} width={50} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
