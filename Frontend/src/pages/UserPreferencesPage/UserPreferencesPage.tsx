import React, { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import BackendApi from "../../services/BackendApi";
import { useNavigate } from "react-router-dom";
import TheGangsLoader from "../../Componets/Loading/loading";


const getUserId = (): number | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData).id : null;
};

// Mock data for initial display
const mockKeywords = [
  { id: 1, name: "superhero" },
  { id: 2, name: "love" },
  { id: 3, name: "friendship" },
  { id: 4, name: "revenge" },
  { id: 5, name: "time travel" },
  { id: 6, name: "coming of age" },
  { id: 7, name: "zombie" },
  { id: 8, name: "alien" },
  { id: 9, name: "dystopia" },
  { id: 10, name: "heist" },
  { id: 11, name: "murder" },
  { id: 12, name: "conspiracy" },
  { id: 13, name: "artificial intelligence" },
  { id: 14, name: "space" },
  { id: 15, name: "vampire" },
  { id: 16, name: "parallel universe" },
  { id: 17, name: "based on true story" },
  { id: 18, name: "survival" },
  { id: 19, name: "magic" },
  { id: 20, name: "robot" },
  { id: 21, name: "detective" },
  { id: 22, name: "apocalypse" },
  { id: 23, name: "adventure" },
];

const mockLanguages = [
  { code: "en", english_name: "English" },
  { code: "vi", english_name: "Vietnamese" },
  { code: "es", english_name: "Spanish" },
  { code: "fr", english_name: "French" },
  { code: "de", english_name: "German" },
  { code: "it", english_name: "Italian" },
  { code: "ja", english_name: "Japanese" },
  { code: "ko", english_name: "Korean" },
  { code: "zh", english_name: "Chinese" },
  { code: "pt", english_name: "Portuguese" },
  { code: "ru", english_name: "Russian" },
  { code: "ar", english_name: "Arabic" },
  { code: "hi", english_name: "Hindi" },
  { code: "th", english_name: "Thai" },
  { code: "tr", english_name: "Turkish" },
  { code: "nl", english_name: "Dutch" },
  { code: "sv", english_name: "Swedish" },
  { code: "pl", english_name: "Polish" },
  { code: "da", english_name: "Danish" },
  { code: "no", english_name: "Norwegian" },
];

const UserPreferencesPage = () => {
  const [genres, setGenres] = useState([]);
  const [keywords, setKeywords] = useState(mockKeywords);
  const [languages, setLanguages] = useState(mockLanguages);
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  const [keywordSearch, setKeywordSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);
  const [isSearchingLanguages, setIsSearchingLanguages] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Replace these useEffect calls with your actual API calls
  useEffect(() => {
    BackendApi.getGenres().then((res) => setGenres(res.data.genres));
    // BackendApi.getKeywords().then((res) => setKeywords(res.data.keywords));
    // BackendApi.getLanguage().then((res) => setLanguages(res.data.languages));
  }, []);

  // Simulated search for keywords (replace with actual API call)
  useEffect(() => {
    if (keywordSearch) {
      setIsSearchingKeywords(true);
      const timer = setTimeout(() => {
        // Replace with: BackendApi.searchKeywords(keywordSearch).then(...)
        const filtered = mockKeywords.filter(k => 
          k.name.toLowerCase().includes(keywordSearch.toLowerCase())
        );
        setKeywords(filtered);
        setIsSearchingKeywords(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setKeywords(mockKeywords);
    }
  }, [keywordSearch]);

  // Simulated search for languages (replace with actual API call)
  useEffect(() => {
    if (languageSearch) {
      setIsSearchingLanguages(true);
      const timer = setTimeout(() => {
        // Replace with: BackendApi.searchLanguages(languageSearch).then(...)
        const filtered = mockLanguages.filter(l => 
          l.english_name.toLowerCase().includes(languageSearch.toLowerCase())
        );
        setLanguages(filtered);
        setIsSearchingLanguages(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLanguages(mockLanguages);
    }
  }, [languageSearch]);

  const toggleSelection = (item, selected, setSelected) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleSubmit = () => {
    const userId = getUserId();
    const payload = {
      user_id: userId,
      preferred_genres: selectedGenres.join(","),
      preferred_keywords: selectedKeywords.join(","),
      preferred_language: selectedLanguages.join(","),
    };
  
    setIsLoading(true);
    BackendApi.saveUserPreferences(payload)
      .then(() => {
        console.log("Preferences saved successfully");
        navigate("/main");
      })
      .catch((error) => {
        console.error("Error saving preferences:", error);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen p-8" style={{ 
      background: "linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, rgb(185, 120, 45) 91.1%)"
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Set Your Preferences</h1>
          <p className="text-white/80 text-lg">Choose what you love to watch</p>
        </div>

        {/* Genres Section */}
        <Section 
          title="Favorite Genres" 
          selectedCount={selectedGenres.length} 
          hasSearch={false} 
          searchValue="" 
          onSearchChange={() => {}} 
          isSearching={false}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <Card
                key={genre.id}
                label={genre.name}
                isSelected={selectedGenres.includes(genre.name)}
                onClick={() => toggleSelection(genre.name, selectedGenres, setSelectedGenres)}
              />
            ))}
          </div>
        </Section>

        {/* Keywords Section */}
        <Section 
          title="Favorite Keywords" 
          selectedCount={selectedKeywords.length}
          hasSearch
          searchValue={keywordSearch}
          onSearchChange={setKeywordSearch}
          isSearching={isSearchingKeywords}
        >
          {selectedKeywords.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedKeywords.map((keyword) => (
                <SelectedChip
                  key={keyword}
                  label={keyword}
                  onRemove={() => toggleSelection(keyword, selectedKeywords, setSelectedKeywords)}
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keywords.map((keyword) => (
              <Card
                key={keyword.id}
                label={keyword.name}
                isSelected={selectedKeywords.includes(keyword.name)}
                onClick={() => toggleSelection(keyword.name, selectedKeywords, setSelectedKeywords)}
              />
            ))}
          </div>
        </Section>

        {/* Languages Section */}
        <Section 
          title="Preferred Languages" 
          selectedCount={selectedLanguages.length}
          hasSearch
          searchValue={languageSearch}
          onSearchChange={setLanguageSearch}
          isSearching={isSearchingLanguages}
        >
          {selectedLanguages.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedLanguages.map((language) => (
                <SelectedChip
                  key={language}
                  label={language}
                  onRemove={() => toggleSelection(language, selectedLanguages, setSelectedLanguages)}
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((language) => (
              <Card
                key={language.code}
                label={language.english_name}
                isSelected={selectedLanguages.includes(language.english_name)}
                onClick={() => toggleSelection(language.english_name, selectedLanguages, setSelectedLanguages)}
              />
            ))}
          </div>
        </Section>

        {/* Submit Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/80 z-50">
          <TheGangsLoader isPref />
        </div>
      )}
    </div>
  );
};

const Section = ({ title, selectedCount, children, hasSearch, searchValue, onSearchChange, isSearching }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {selectedCount > 0 && (
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedCount} selected
          </span>
        )}
      </div>
      {hasSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}
    </div>
    {children}
  </div>
);

const Card = ({ label, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative p-4 rounded-xl cursor-pointer transition-all duration-200
      backdrop-blur-sm border-2
      ${isSelected 
        ? 'bg-white/20 border-white/60 shadow-lg scale-105' 
        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 hover:scale-102'
      }
    `}
  >
    <div className="flex items-center justify-between">
      <span className="text-white font-medium">{label}</span>
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-purple-600" />
        </div>
      )}
    </div>
  </div>
);

const SelectedChip = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default UserPreferencesPage;