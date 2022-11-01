import axios from "axios";
import cheerio from "cheerio";

export const getDarazProducts = async (req, res, next) => {
  console.log(req.params.product);
  try {
    const searchUrl = `https://www.daraz.com.np/catalog/?q=${req.params.product}`;

    const { data } = await axios.get(searchUrl);
    const matchedData = data.match(/window.pageData=(.+)<\/script>/)[0];
    const wantedData = matchedData
      .replace("window.pageData=", "")
      .replace("</script>", "");
    const dataJson = JSON.parse(wantedData);

    var items = [];

    dataJson.mods.listItems.map((el) => {
      items.push({
        image: el.image,
        priceShow: el.priceShow,
        name: el.name,
        nid: el.nid,
        sellerName: el.sellerName,
        description: el.description,
        productUrl: el.productUrl,
        price: el.price,
        ratingScore: el.rating,
        review: el.review,
      });
    });

    res.status(200).json({
      vendor: "daraz",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAmazonProducts = async (req, res, next) => {
  console.log(req.params.product);

  try {
    const searchUrl = `https://www.amazon.com/s?k=${req.params.product}`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "axios 0.21.1",
      },
    });
    const $ = cheerio.load(data);
    const list = $(".s-widget-spacing-small");

    const items = [];
    list.each((i, el) => {
      const description = $(el).find(".a-size-medium").text();
      const price = $(el).find(".a-price-whole").text().replace(".", "");
      const image = $(el).find(".s-image").attr("src");
      const link = $(el).find(".a-link-normal").attr("href");
      const rating = $(el).find(".aok-align-bottom .a-icon-alt").text();
      const review = $(el).find(".s-link-style .s-underline-text").text();
      const nid = $(el).find(".sg-col-inner > div").attr("data-csa-c-item-id");
      var descArray = description.split("|").map((e) => e.split(","));
      items.push({
        image: image,
        priceShow: price == "" ? null : `$ ${price}/-`,
        name: descArray[0],
        nid: nid,
        sellerName: "",
        description: descArray,
        productUrl: link,
        price: price,
        ratingScore: rating.split(" ")[0],
        review: review,
      });
    });

    res.status(200).json({
      vendor: "amazon",
      listItems: items,
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};
