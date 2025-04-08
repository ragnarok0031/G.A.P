"use client";
import React from "react";

function MainComponent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [translations, setTranslations] = useState({
    es: {
      inicio: "Inicio",
      nosotros: "Nosotros",
      academico: "Académico",
      contacto: "Contacto",
      formandoLideres: "Formando Líderes del Mañana",
      excelenciaAcademica: "Excelencia académica y valores humanos",
      conoceMas: "Conoce más",
      nuestraInstitucion: "Nuestra Institución",
      programasEducativos:
        "Programas educativos de alta calidad para el desarrollo integral.",
      comunidad: "Comunidad",
      ambienteInclusivo:
        "Ambiente inclusivo y colaborativo para el aprendizaje.",
      valores: "Valores",
      formacionIntegral: "Formación integral basada en principios y valores.",
      descargarBrochure: "Descargar Brochure",
      generandoPDF: "Generando PDF...",
      ubicacion: "Ubicación",
      ubicacionTexto:
        "Nos encontramos ubicados en Los Negros, Bolivia. Visítanos y conoce nuestras instalaciones.",
      ofertaAcademica: "Oferta Académica",
      educacionBasica: "Educación Básica",
      educacionMedia: "Educación Media",
      contactoTitulo: "Contacto",
      nombreCompleto: "Nombre completo",
      correoElectronico: "Correo electrónico",
      mensaje: "Mensaje",
      enviarMensaje: "Enviar mensaje",
      buscarSitio: "Buscar en el sitio...",
      derechosReservados:
        "© 2025 U.E. Guido Arce Pimentel. Todos los derechos reservados.",
    },
    en: {
      inicio: "Home",
      nosotros: "About Us",
      academico: "Academic",
      contacto: "Contact",
      formandoLideres: "Forming Tomorrow's Leaders",
      excelenciaAcademica: "Academic excellence and human values",
      conoceMas: "Learn More",
      nuestraInstitucion: "Our Institution",
      programasEducativos:
        "High-quality educational programs for comprehensive development.",
      comunidad: "Community",
      ambienteInclusivo: "Inclusive and collaborative learning environment.",
      valores: "Values",
      formacionIntegral:
        "Comprehensive education based on principles and values.",
      descargarBrochure: "Download Brochure",
      generandoPDF: "Generating PDF...",
      ubicacion: "Location",
      ubicacionTexto:
        "We are located in Los Negros, Bolivia. Visit us and get to know our facilities.",
      ofertaAcademica: "Academic Offering",
      educacionBasica: "Primary Education",
      educacionMedia: "Secondary Education",
      contactoTitulo: "Contact",
      nombreCompleto: "Full name",
      correoElectronico: "Email",
      mensaje: "Message",
      enviarMensaje: "Send message",
      buscarSitio: "Search the site...",
      derechosReservados:
        "© 2025 U.E. Guido Arce Pimentel. All rights reserved.",
    },
  });

  useEffect(() => {
    fetch("/integrations/weather-by-city/weather/Pampagrande")
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/integrations/google-search/search?q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (err) {
      setError("Error al realizar la búsqueda");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setCurrentLanguage(newLanguage);
  };

  const t = (key) =>
    translations[currentLanguage][key] || translations["es"][key];

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const generateBrochurePDF = async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `
            <h1>U.E. Guido Arce Pimentel</h1>
            <h2>${t("nuestraInstitucion")}</h2>
            <p>${t("programasEducativos")}</p>
          `,
          format: "html",
        }),
      });

      if (!response.ok) throw new Error("Error al generar el PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "brochure-gap.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setPdfError("Error al generar el PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-white"}`}
    >
      <header className="fixed w-full top-0 z-50 bg-[#4e946a] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/logo.png"
                alt="Logo Guido Arce Pimentel"
                className="h-12 w-auto"
              />
              <h1 className="hidden md:block text-xl md:text-2xl font-inter font-bold">
                U.E. Guido Arce Pimentel
              </h1>
              <h1 className="md:hidden text-xl font-inter font-bold">G.A.P</h1>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#inicio" className="hover:text-gray-200 font-inter">
                  {t("inicio")}
                </a>
                <a href="#nosotros" className="hover:text-gray-200 font-inter">
                  {t("nosotros")}
                </a>
                <a href="#academico" className="hover:text-gray-200 font-inter">
                  {t("academico")}
                </a>
                <a href="#contacto" className="hover:text-gray-200 font-inter">
                  {t("contacto")}
                </a>
              </nav>

              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#4e946a] border border-white rounded px-2 py-1"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>

              <button onClick={toggleDarkMode} className="p-2 rounded-md">
                <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i>
              </button>

              {weatherData && (
                <div className="flex items-center">
                  <i className="fas fa-cloud mr-2"></i>
                  <span>{Math.round(weatherData.current.temp_c)}°C</span>
                </div>
              )}
            </div>

            <button onClick={toggleMenu} className="md:hidden p-2">
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-4">
                <a href="#inicio" className="hover:text-gray-200 font-inter">
                  {t("inicio")}
                </a>
                <a href="#nosotros" className="hover:text-gray-200 font-inter">
                  {t("nosotros")}
                </a>
                <a href="#academico" className="hover:text-gray-200 font-inter">
                  {t("academico")}
                </a>
                <a href="#contacto" className="hover:text-gray-200 font-inter">
                  {t("contacto")}
                </a>
              </nav>
            </div>
          )}

          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("buscarSitio")}
                className="flex-1 px-4 py-2 rounded-md text-gray-900"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-white text-[#4e946a] rounded-md hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-search"></i>
                )}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg text-gray-900">
                {searchResults.map((result, index) => (
                  <a
                    key={index}
                    href={result.link}
                    className="block p-2 hover:bg-gray-100"
                  >
                    {result.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-40">
        <section id="inicio" className="relative h-[600px]">
          <img
            src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg"
            alt="Estudiantes en el campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h2 className="text-4xl md:text-6xl font-inter font-bold mb-4">
                {t("formandoLideres")}
              </h2>
              <p className="text-xl md:text-2xl font-inter mb-8">
                {t("excelenciaAcademica")}
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-inter px-8 py-3 rounded-md">
                {t("conoceMas")}
              </button>
            </div>
          </div>
        </section>

        <section
          id="nosotros"
          className="py-16 px-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t("nuestraInstitucion")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-graduation-cap text-3xl text-gray-900 dark:text-white mb-4"></i>
                <h3 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-2">
                  {t("excelenciaAcademica")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  {t("programasEducativos")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-users text-3xl text-gray-900 dark:text-white mb-4"></i>
                <h3 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-2">
                  {t("comunidad")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  {t("ambienteInclusivo")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-book text-3xl text-gray-900 dark:text-white mb-4"></i>
                <h3 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-2">
                  {t("valores")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  {t("formacionIntegral")}
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={generateBrochurePDF}
                disabled={pdfLoading}
                className="bg-[#4e946a] hover:bg-[#3d7554] text-white font-inter px-8 py-3 rounded-md inline-flex items-center"
              >
                {pdfLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {t("generandoPDF")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf mr-2"></i>
                    {t("descargarBrochure")}
                  </>
                )}
              </button>
              {pdfError && <p className="mt-2 text-red-500">{pdfError}</p>}
            </div>
          </div>
        </section>

        <section id="ubicacion" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t("ubicacion")}
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3794.8657657559477!2d-64.1237868!3d-18.0633661!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f013006e9e0c51%3A0x5d3dfe25282e64aa!2sUE%20%22Guido%20Arce%20Pimentel%22!5e0!3m2!1ses!2sbo!4v1712454789045!5m2!1ses!2sbo"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-inter">
                {t("ubicacionTexto")}
              </p>
            </div>
          </div>
        </section>

        <section id="academico" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t("ofertaAcademica")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-4">
                  {t("educacionBasica")}
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-inter">
                  <li>• Primer a Sexto Grado</li>
                  <li>• Programas especializados</li>
                  <li>• Actividades extracurriculares</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-4">
                  {t("educacionMedia")}
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-inter">
                  <li>• Séptimo a Duodécimo Grado</li>
                  <li>• Bachillerato en Ciencias</li>
                  <li>• Orientación vocacional</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contacto"
          className="py-16 px-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t("contactoTitulo")}
            </h2>
            <div className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder={t("nombreCompleto")}
                    className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-inter"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("correoElectronico")}
                    className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-inter"
                  />
                </div>
                <div>
                  <textarea
                    name="mensaje"
                    placeholder={t("mensaje")}
                    rows="4"
                    className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-inter"
                  ></textarea>
                </div>
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-inter px-8 py-3 rounded-md">
                  {t("enviarMensaje")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#4e946a] text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-inter font-bold mb-4">
                U.E. Guido Arce Pimentel
              </h3>
              <p className="text-gray-100 font-inter">
                Formando el futuro de Bolivia
              </p>
            </div>
            <div>
              <h4 className="text-lg font-inter font-bold mb-4">
                {t("contacto")}
              </h4>
              <p className="text-gray-100 font-inter">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Los Negros, Bolivia
              </p>
              <p className="text-gray-100 font-inter">
                <i className="fas fa-phone mr-2"></i>
                Teléfono: (123) 456-7890
              </p>
              <p className="text-gray-100 font-inter">
                <i className="fas fa-envelope mr-2"></i>
                Email: contacto@guidoarce.edu.bo
              </p>
            </div>
            <div>
              <h4 className="text-lg font-inter font-bold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-200">
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-100 font-inter">
              {t("derechosReservados")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
