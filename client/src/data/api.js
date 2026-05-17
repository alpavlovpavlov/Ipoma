import { clearUserData, getUser } from "../util/util.js";

export const host = "https://ipoma.onrender.com";

async function request(method, url, data, isFile = false) {
  const options = {
    method,
    headers: {},
    cache: "no-store"
  };

  const user = getUser();

  if (user != null) {
    options.headers["X-Authorization"] = user.accessToken;
  };

  if (data != undefined) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  };

  try {
    const response = await fetch(host + url, options);

    if (response.ok == false) {
      if (response.status == 403) {
        clearUserData();
      }
      const error = await response.json();
      
      throw error;
    };

    if (response.status == 204) {
      return response;
    };

    if (isFile) {
      return response;
    };

    return response.json();
  } catch (error) {
    //alert(error.message);
    throw error.message;
  };
};

export const get = request.bind(null, "get");
export const post = request.bind(null, "post");
export const put = request.bind(null, "put");
export const del = request.bind(null, "delete");
