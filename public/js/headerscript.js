$(function () {
  $(".ui.search.db").search({
    apiSettings: {
      url: "../searchdb?q=%{query}",
    },
    maxResults: 10,
    showNoResults: false,
  });
});
