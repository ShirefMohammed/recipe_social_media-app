const GetUserId = () => {
  const userId = window.localStorage.getItem("userId");
  return userId;
}

export default GetUserId
