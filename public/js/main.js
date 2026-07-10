document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookieBanner");
  const accept = document.getElementById("cookieAccept");
  const deny = document.getElementById("cookieDeny");
  const manage = document.getElementById("cookieManage");

  const dismiss = () => banner.classList.add("hidden");

  if (accept) accept.addEventListener("click", dismiss);
  if (deny) deny.addEventListener("click", dismiss);
  if (manage) manage.addEventListener("click", dismiss);
});
