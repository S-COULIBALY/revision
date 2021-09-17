// 404 HTML
module.exports.pageNotFound = {
  notFound: (request, response) => {
    response.sendFile("/views/404.html", { root: __dirname + "/.." });
  },
};
