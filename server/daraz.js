const axios = require("axios");

class Daraz {
  static searchUrl = (name) => `https://www.daraz.com.np/catalog/?q=${name}`;

  static getItems = async (name) => {
    try {
      const { data } = await axios.get(this.searchUrl(name));

      const matchedData = data.match(/window.pageData=(.+)<\/script>/)[0];
      const wantedData = matchedData
        .replace("window.pageData=",'')
        .replace("</script>",'');
      const dataJson = JSON.parse(wantedData);
      return dataJson;
    } catch (e) {
      return "No data found!";
    }
  };
}

module.exports = Daraz;
