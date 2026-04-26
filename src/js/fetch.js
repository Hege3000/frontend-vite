/**
 * Fetches JSON data from APIs
 * AI-assisted: virheenkäsittelyn rakenne toteutettu AI:n avulla - Claude / Gemini
 * 
 * @param {string} url - api endpoint url
 * @param {Object} options - request options
 *
 * @returns {Object} response json data
 */
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
  const errorData = await response.json();
  const message = errorData.error?.message || errorData.message || 'An error occurred';
  const errors = errorData.error?.errors || [];
  // muodostetaan luettava virheilmoitus
  if (errors.length > 0) {
    const errorMessages = errors.map(e => e.message).join(', ');
    return { error: errorMessages };
  }
  return { error: message };
}
    return await response.json(); // Return successful response data
  } catch (error) {
    console.error('fetchData() error:', error.message);
    return { error: error.message };
  }
};

export { fetchData };