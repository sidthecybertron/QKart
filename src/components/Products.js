import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [productResponse, setProductResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [empty, setEmpty] = useState(false);
  const [cartResponse,setCartResponse] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const uname = localStorage.getItem("username");
  console.log("Username",uname);
  const token = localStorage.getItem("token");
  const [arr,setArr] = useState([]);

  // const product = {
  //   "name":"Tan Leatherette Weekender Duffle",
  //   "category":"Fashion",
  //   "cost":150,
  //   "rating":4,
  //   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   "_id":"PmInA797xJhMIPti"
  //   }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async (ProductQuery) => {
    setLoading(true);
    console.log("Hi entered perform API CALL");
    // let url = config.endpoint+"/products";
    try {
      console.log("Hello Responses");
      // <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
      // <CircularProgress color="success" />
      // </Stack>

      // const res = await axios.get(`${config.endpoint}/products`);

      // Old
      // if (ProductQuery !== "") {
      //   url = `${url}/search?value=${ProductQuery}`;
      //   // let res = axios.get(url);
      //   // return res;
      // }

      const res = await axios.get(config.endpoint + "/products");
      console.log(res.data);
      //console.log(res.data.length);
      setProductResponse(res.data);
      setArr(res.data);
      setLoading(false);
      //Old
      // setEmpty(false);
      // if(ProductQuery!==res.data.name || ProductQuery!==res.data.category){
      //   console.log("No Products Found");
      // }
      // return res.data;

      //<CircularProgress color="success" />
      //console.log("statevariable",productResponse);
      //return res;
    } catch (err) {
      //Old
      setLoading(false);
      console.log(
        "Something went wrong. Check the backend console for more details"
      );
      // Old
      // if(err.response.status === 404){
      //   setEmpty(true);
      // }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    //New idea
    try {
      const res = await axios.get(
        config.endpoint + "/products/search?value=" + text
      );
      console.log(res);
      setProductResponse(res.data);
      setEmpty(false);
    } catch (e) {
      if (e.response.status == 404) {
        setEmpty(true);
      }
    }

    // console.log(searchKey);
    // let url = config.endpoint+"/products";
    // try{
    //   if (searchKey !== "") {
    //     url = `${url}/search?value=${searchKey}`;
    //     let res = axios.get(url);
    //     setProductResponse(res.data);
    //   }
    // }
    // catch(err){
    //   <><SentimentDissatisfied/>No Products Found</>
    // }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const [debounceTimeout, setDebounceTimeout] = useState(500);
  const debounceSearch = (event, debounceTimeout) => {
    setSearchKey(event.target.value);
    // clearTimeout(debounceTimer);
    // debounceTimer = setTimeout(() => performSearch(event.target.value),
    //     debounceTimeout );
  };

  useEffect(() => {
    performAPICall();
  }, []);
  useEffect(() => {
    if (searchKey) {
      if (debounceTimeout !== 0) {
        clearTimeout(debounceTimeout);
      }
      const newTimeout = setTimeout(() => performSearch(searchKey), 500);
      setDebounceTimeout(newTimeout);
    }
  }, [searchKey]);

  // useEffect(() => {
  //   performAPICall(searchKey);
  // }, [searchKey]);
  // useEffect(() => {
  //   performSearch();
  // }, []);

  useEffect(() => {
    fetchCart(token);
  }, [token]);
  
  //FetchCart
  const fetchCart = async (token) => {
    console.log("Tokens",token);
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res = await axios.get(config.endpoint+"/cart", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setCartResponse(res.data);
      console.log("Cart Res",res.data);
      return res;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    console.log("Items",items);
    console.log("productId",productId);
    for(let i=0;i<items.length;i++){
      if(items[i].productId===productId){
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */ 
  
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("Values",token,items,products,productId,qty);
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"});
    }
    else if(isItemInCart(items, productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"})
    }
    else{
      try{
        let sendCartRes = await axios.post(config.endpoint+"/cart",{"productId":productId,"qty":qty},{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCartResponse(sendCartRes.data);
      }
      catch(err){
        console.log(err);
      }
      
    }
  };

  //newTry
  // const addToCart = async (
  //   token,
  //   items,
  //   products,
  //   productId,
  //   qty,
  //   options = { preventDuplicate: false }
  // ) => {
  //   console.log(token+" "+items+" "+products+" "+productId+" "+qty);
  //   if(!token){
  //     enqueueSnackbar("Login to add an item to the Cart",{variant:'warning'});
  //   }else if(isItemInCart(items,productId)){
  //     enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item",{variant:'warning'})
  //   }else{
  //     try {
  //       // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
  //       let sentData = await axios.post(`${config.endpoint}/cart`,{"productId":productId,"qty":qty},
  //         {headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       })
  //      ;

       
  //      //fetchCart();
  //      setCartResponse(sentData.data);
  
  //     //  return fetchedData
  
  //     } catch (e) {
  //         console.log(e);
  //     }
  //   }
  // };
  // console.log("generate Items",generateCartItemsFrom(cartResponse,arr))
  return (
    <div>
      <Header
        children={
          <TextField
            className="search-desktop"
            size="small"
            // fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            value={searchKey}
            onChange={debounceSearch}/>
          }/>

      

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchKey}
        onChange={(event) => {
          debounceSearch(event, 500);
        }}
      />
      <Grid container>
        <Grid item md className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
      {/* let arr = performAPICall();
       arr.map((productResponse)=>{<ProductCard product={productResponse}/>});  */}

      {/* {loading ? (<><CircularProgress/>Loading Products</>) : (<div>{empty ? (<><SentimentDissatisfied/>No Products Found</>) : (<Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      { productResponse.map((item) => {
       return(
        <Grid item md={3} xs={6}>
        <ProductCard product={item}/>
        </Grid>
        );
       })}
      </Grid>)}</div>)} */}

      {/* Old */}
      {empty ? (
        <>
          <SentimentDissatisfied />
          No Products Found
        </>
      ) : (
        <div>
          {loading ? (
            <>
              <CircularProgress />
              Loading Products
            </>
          ) : (
            <Grid
              container
              spacing={{ xs: 2, md: 2 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {productResponse.map((itemVal) => {

                return (
                  <Grid item md={3} xs={2}>
                    <ProductCard product={itemVal} handleAddToCart={()=>{addToCart(token,cartResponse,productResponse,itemVal._id,1)}}/>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      )}
      </Grid>
      {uname?
        <Grid item md={3} style={{backgroundColor: '#E9F5E1' }}>
        <Cart products={arr}
        items={generateCartItemsFrom(cartResponse,arr)
        }
        handleQuantity={addToCart}
        />
      </Grid>:""
      }
      </Grid>

      {/* Old */}
      {/* {loading ? <><CircularProgress/>Loading Products</>  : <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      { productResponse.map((item) => {
       return(
        <Grid item md={3} xs={6}>
        <ProductCard product={item}/>
        </Grid>
        );
       })}
      </Grid>}  */}

      <br />
      <Footer />
    </div>
  );
};

export default Products;
