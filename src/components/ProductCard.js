import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,Box,CardActionArea
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const ProductCard = ({ product, handleAddToCart }) => {
  //console.log("pr",product);
  return (
    
    <Card className="card">
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            ${product.cost}
          </Typography>
          <Rating  value={product.rating} readOnly />
          {/* <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
        </CardContent>
      </CardActionArea>
      <Button fullWidth className="card-button" variant="contained" name="cart" onClick={handleAddToCart}>
        <AddShoppingCartOutlined />
                ADD TO CART
              </Button>    
      </Card>
  );
};

export default ProductCard;
