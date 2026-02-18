import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dogs.css";

export default function Home() {
  const [dogImage, setDogImage] = useState(null);
  const [dogFact, setDogFact] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDogData = async () => {
    setLoading(true);

    try {
      const [imgRes, factRes] = await Promise.all([
        fetch("https://dog.ceo/api/breeds/image/random"),
        fetch("https://dogapi.dog/api/v2/facts?limit=1"),
      ]);

      const imgData = await imgRes.json();
      const factData = await factRes.json();

      setDogImage(imgData.message);
      setDogFact(factData.data[0].attributes.body);
    } catch (error) {
      console.error("Error fetching dog data:", error);
      setDogFact("Failed to load dog fact 😢");
    }

    setLoading(false);
  };
  function goTo(){
    navigate("/room1");

  }

  useEffect(() => {
    fetchDogData();
  }, []);

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <div className="dog-container">
      <div className="dog-card">
        <h1>🐶 Dog Explorer</h1>

        {loading ? (
          <div className="loader"></div>
        ) : (
          <>
            <img src={dogImage} alt="Random Dog" />
            <p className="dog-fact">{dogFact}</p>
            <button onClick={fetchDogData}>Load Another Dog</button>
            <button onClick={goTo}>Join the chat!</button>
            <button onClick={logOut}>Log Out</button>
          </>
        )}
      </div>
    </div>
  );
}
