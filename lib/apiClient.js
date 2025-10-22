const baseUrl = 'http://localhost:8000/api'; // TODO: Update with your actual backend API base URL

// Generic fetcher for SWR
export const fetcher = (path) => apiFetch(path);

// Core fetch function
export async function apiFetch(path, options = {}) {
  const url = `${baseUrl}${path}`;
  console.log(`API Fetching: ${url}`, options);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const res = await fetch(url, {
      ...options,
      headers,
      // credentials: 'include', // Uncomment if you need cookies
    });

    // Check if response is ok
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errorMessage = `API error: ${res.status} ${res.statusText}`;

      // Try to get error details from response
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await res.json();
          if (res.status === 422 && errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(' ');
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          // If JSON parsing fails, use default message
        }
      } else {
        // If it's HTML or other content, provide more context
        const text = await res.text();
        if (text.includes('<!doctype') || text.includes('<html>')) {
          errorMessage = `Server returned HTML instead of JSON. Check if the API endpoint exists: ${url}`;
        }
      }

      throw new Error(errorMessage);
    }

    // Handle different content types
    const contentType = res.headers.get('content-type');
    
    // Handle text responses (like mermaid diagrams)
    if (contentType && contentType.includes('text/plain')) {
      return res.text();
    }
    
    // Handle JSON responses
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    
    // If no content-type or unknown type, try to parse as text first
    const text = await res.text();
    
    // Check if it's HTML error page
    if (text.includes('<!doctype') || text.includes('<html>')) {
      throw new Error(`Server returned HTML instead of expected data. Check if the API endpoint exists: ${url}`);
    }
    
    // Try to parse as JSON if it looks like JSON
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        return JSON.parse(text);
      } catch (e) {
        // If JSON parsing fails, return as text
        return text;
      }
    }
    
    // Return as text for other cases
    return text;
  } catch (error) {
    // Add more context to the error
    if (error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${url}. Check if the server is running.`);
    }
    throw error;
  }
}

// Convenience methods
export function get(path, options = {}) {
  return apiFetch(path, { ...options, method: 'GET' });
}

export function post(path, data, options = {}) {
  console.log(`API POSTing to: ${path}`, { data, options });
  const headers = { ...(options.headers || {}) };
  let body = data;

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  return apiFetch(path, {
    ...options,
    method: 'POST',
    headers,
    body,
  });
}

export function put(path, data, options = {}) {
  return apiFetch(path, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: JSON.stringify(data),
  });
}

export function del(path, options = {}) {
  return apiFetch(path, { ...options, method: 'DELETE' });
}