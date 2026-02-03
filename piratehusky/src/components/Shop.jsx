import { useEffect } from "react";

export default function Shop() {
  useEffect(() => {
    // Avoid loading script multiple times
    if (document.getElementById("shopify-buy-button-script")) return;

    const script = document.createElement("script");
    script.id = "shopify-buy-button-script";
    script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
    script.async = true;
    script.onload = () => {
      if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          ShopifyBuyInit();
        }
      }
    };
    document.body.appendChild(script);

    function ShopifyBuyInit() {
      const client = window.ShopifyBuy.buildClient({
        domain: "jfubze-z1.myshopify.com",
        storefrontAccessToken: "0ee65f5109f540234bb785b2bb1cdf05",
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent("collection", {
          id: "610749186321",
          node: document.getElementById("collection-component-1740042720538"),
          moneyFormat: "%7B%7Bamount_with_comma_separator%7D%7D kr",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(33.33333% - 30px)",
                    "margin-left": "30px",
                    "margin-bottom": "50px",
                    "width": "calc(33.33333% - 30px)",
                  },
                  img: {
                    height: "calc(100% - 15px)",
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "0",
                  },
                  imgWrapper: {
                    "padding-top": "calc(75% + 15px)",
                    position: "relative",
                    height: "0",
                  },
                },
                button: {
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                },
              },
              text: {
                button: "Add to cart",
              },
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": {
                    "margin-left": "-30px",
                  },
                },
              },
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true,
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px",
                  },
                },
                button: {
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                },
              },
              text: {
                button: "Add to cart",
              },
            },
            cart: {
              styles: {
                button: {
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                },
              },
              text: {
                total: "Subtotal",
                button: "Checkout",
              },
            },
            toggle: {
              styles: {
                toggle: {
                  "background-color": "#000000",
                  ":hover": { "background-color": "#000000" },
                  ":focus": { "background-color": "#000000" },
                },
              },
            },
          },
        });
      });
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shop</h2>
      <div id="collection-component-1740042720538"></div>
    </div>
  );
}
